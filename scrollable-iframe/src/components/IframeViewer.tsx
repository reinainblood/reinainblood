import { Resizable } from 're-resizable';
import { ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Comment {
  id: string;
  lineNumber: number;
  text: string;
  author: string;
  timestamp: Date;
}

interface IframeViewerProps {
  htmlContent: string;
  title?: string;
}

export function IframeViewer({ htmlContent, title }: IframeViewerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleOpenInNewTab = () => {
    const blob = new Blob([processedHtmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Process HTML to add line numbers
  const addLineNumbers = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove the "back to proposals" link but keep the theme toggle
    const backLink = doc.querySelector('.back-link');
    if (backLink) {
      backLink.remove();
    }
    
    // Center the theme toggle if it exists
    const navContent = doc.querySelector('.nav-content');
    if (navContent) {
      navContent.setAttribute('style', 'justify-content: flex-end;');
    }
    
    // Find the article content or main body content
    const article = doc.querySelector('article') || doc.body;
    if (!article) return html;

    // Get all text-containing elements that should have line numbers
    const textElements = article.querySelectorAll('p, li, h2, h3, h4, h5, h6, .abstract p, .qa-answer, .qa-question');
    let lineNumber = 1;

    textElements.forEach((element) => {
      // Skip if already processed
      if (element.classList.contains('line-numbered')) return;
      
      const textContent = element.textContent || '';
      // Split into logical lines (sentences or at reasonable length)
      const lines = splitIntoLines(textContent);
      
      if (lines.length === 1 && textContent.length < 200) {
        // Single short line - wrap the whole element
        const wrapper = doc.createElement('div');
        wrapper.className = 'line-numbered';
        wrapper.setAttribute('data-line', lineNumber.toString());
        element.parentNode?.insertBefore(wrapper, element);
        wrapper.appendChild(element.cloneNode(true));
        element.remove();
        lineNumber++;
      } else {
        // Multiple lines or long content - wrap in line-numbered container
        const wrapper = doc.createElement('div');
        wrapper.className = 'line-numbered-block';
        element.parentNode?.insertBefore(wrapper, element);
        
        lines.forEach((line) => {
          if (line.trim()) {
            const lineDiv = doc.createElement('div');
            lineDiv.className = 'line-numbered';
            lineDiv.setAttribute('data-line', lineNumber.toString());
            lineDiv.textContent = line;
            wrapper.appendChild(lineDiv);
            lineNumber++;
          }
        });
        
        element.remove();
      }
    });

    // Add CSS for line numbers and comments
    const style = doc.createElement('style');
    style.textContent = `
      .line-numbered, .line-numbered-block .line-numbered {
        position: relative;
        padding-left: 60px;
        margin-left: -60px;
      }
      
      .line-numbered::before {
        content: attr(data-line);
        position: absolute;
        left: 0;
        width: 45px;
        text-align: right;
        color: #9ca0b0;
        font-size: 0.75rem;
        font-family: 'IBM Plex Mono', monospace;
        user-select: none;
        cursor: pointer;
        padding-right: 12px;
        opacity: 0.5;
        transition: opacity 0.2s, color 0.2s;
      }
      
      .line-numbered:hover::before {
        opacity: 1;
        color: #1e66f5;
      }
      
      .line-numbered.has-comment::before {
        color: #fe640b;
        opacity: 1;
        font-weight: 600;
      }
      
      .line-numbered.active-comment {
        background-color: #fef9e7;
        margin-right: -16px;
        padding-right: 16px;
      }
      
      [data-theme="frappe"] .line-numbered.active-comment {
        background-color: rgba(239, 159, 118, 0.15);
      }
      
      .comment-box-container {
        margin-left: 60px;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        background: white;
        border: 2px solid #1e66f5;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideDown 0.2s ease-out;
      }
      
      [data-theme="frappe"] .comment-box-container {
        background: var(--crust);
        border-color: var(--blue);
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .comment-box-header {
        font-size: 0.9rem;
        font-weight: 600;
        color: #4c4f69;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      [data-theme="frappe"] .comment-box-header {
        color: var(--text);
      }
      
      .comment-box-header::before {
        content: '';
        width: 28px;
        height: 28px;
        background: #e6e9ef;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      [data-theme="frappe"] .comment-box-header::before {
        background: var(--surface0);
      }
      
      .comment-input {
        width: 100%;
        padding: 0.75rem;
        background: white;
        border: 1px solid #ccd0da;
        border-radius: 6px;
        color: #4c4f69;
        font-family: inherit;
        font-size: 0.9rem;
        resize: vertical;
        min-height: 80px;
        transition: border-color 0.2s;
      }
      
      [data-theme="frappe"] .comment-input {
        background: var(--base);
        border-color: var(--surface1);
        color: var(--text);
      }
      
      .comment-input:focus {
        outline: none;
        border-color: #1e66f5;
      }
      
      .comment-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
        justify-content: flex-end;
      }
      
      .comment-btn {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: inherit;
      }
      
      .comment-btn-primary {
        background: #1e66f5;
        color: white;
      }
      
      .comment-btn-primary:hover {
        background: #1557d8;
      }
      
      .comment-btn-primary:disabled {
        background: #acb0be;
        cursor: not-allowed;
      }
      
      .comment-btn-secondary {
        background: #e6e9ef;
        color: #4c4f69;
      }
      
      [data-theme="frappe"] .comment-btn-secondary {
        background: var(--surface0);
        color: var(--text);
      }
      
      .comment-btn-secondary:hover {
        background: #dce0e8;
      }
      
      [data-theme="frappe"] .comment-btn-secondary:hover {
        background: var(--surface1);
      }
      
      .comment-thread {
        margin-left: 60px;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .comment-item {
        background: white;
        border: 1px solid #dce0e8;
        border-radius: 8px;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }
      
      [data-theme="frappe"] .comment-item {
        background: var(--mantle);
        border-color: var(--surface1);
      }
      
      .comment-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      
      .comment-author {
        font-weight: 600;
        color: #4c4f69;
        font-size: 0.85rem;
      }
      
      [data-theme="frappe"] .comment-author {
        color: var(--text);
      }
      
      .comment-time {
        color: #9ca0b0;
        font-size: 0.75rem;
      }
      
      .comment-text {
        color: #5c5f77;
        line-height: 1.6;
        font-size: 0.9rem;
      }
      
      [data-theme="frappe"] .comment-text {
        color: var(--subtext1);
      }
      
      .comment-delete {
        background: none;
        border: none;
        color: #9ca0b0;
        cursor: pointer;
        padding: 0.25rem;
        font-size: 0.75rem;
        transition: color 0.2s;
      }
      
      .comment-delete:hover {
        color: #d20f39;
      }
    `;
    doc.head.appendChild(style);

    // Add click handler script for line numbers
    const script = doc.createElement('script');
    script.textContent = `
      let activeCommentBox = null;
      let currentLineNumber = null;
      
      window.addEventListener('message', function(event) {
        if (event.data.type === 'updateComments') {
          const comments = event.data.comments;
          
          // Remove existing comment threads and boxes
          document.querySelectorAll('.comment-thread, .comment-box-container').forEach(el => el.remove());
          document.querySelectorAll('.line-numbered').forEach(el => {
            el.classList.remove('has-comment', 'active-comment');
          });
          
          // Group comments by line
          const commentsByLine = {};
          comments.forEach(comment => {
            if (!commentsByLine[comment.lineNumber]) {
              commentsByLine[comment.lineNumber] = [];
            }
            commentsByLine[comment.lineNumber].push(comment);
          });
          
          // Add comment indicators and threads
          Object.keys(commentsByLine).forEach(lineNumber => {
            const lineEl = document.querySelector('[data-line="' + lineNumber + '"]');
            if (lineEl) {
              lineEl.classList.add('has-comment');
              
              // Create comment thread
              const thread = document.createElement('div');
              thread.className = 'comment-thread';
              
              commentsByLine[lineNumber].forEach(comment => {
                const commentEl = document.createElement('div');
                commentEl.className = 'comment-item';
                commentEl.innerHTML = \`
                  <div class="comment-item-header">
                    <span class="comment-author">\${comment.author}</span>
                    <button class="comment-delete" onclick="deleteComment('\${comment.id}')">Delete</button>
                  </div>
                  <div class="comment-text">\${comment.text}</div>
                  <div class="comment-time">\${new Date(comment.timestamp).toLocaleString()}</div>
                \`;
                thread.appendChild(commentEl);
              });
              
              lineEl.parentNode.insertBefore(thread, lineEl.nextSibling);
            }
          });
        }
      });
      
      function deleteComment(commentId) {
        window.parent.postMessage({ type: 'deleteComment', commentId: commentId }, '*');
      }
      
      function showCommentBox(lineNumber) {
        // Remove any existing comment box
        if (activeCommentBox) {
          activeCommentBox.remove();
          document.querySelectorAll('.line-numbered').forEach(el => {
            el.classList.remove('active-comment');
          });
        }
        
        const lineEl = document.querySelector('[data-line="' + lineNumber + '"]');
        if (!lineEl) return;
        
        currentLineNumber = lineNumber;
        lineEl.classList.add('active-comment');
        
        // Create comment box
        const commentBox = document.createElement('div');
        commentBox.className = 'comment-box-container';
        commentBox.innerHTML = \`
          <div class="comment-box-header">Add a comment on line \${lineNumber}</div>
          <textarea class="comment-input" placeholder="Leave a comment..." id="commentInput"></textarea>
          <div class="comment-actions">
            <button class="comment-btn comment-btn-secondary" onclick="cancelComment()">Cancel</button>
            <button class="comment-btn comment-btn-primary" onclick="submitComment()">Comment</button>
          </div>
        \`;
        
        // Find the right place to insert (after any existing comment thread)
        let insertAfter = lineEl;
        const nextSibling = lineEl.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('comment-thread')) {
          insertAfter = nextSibling;
        }
        
        insertAfter.parentNode.insertBefore(commentBox, insertAfter.nextSibling);
        activeCommentBox = commentBox;
        
        // Focus the textarea
        setTimeout(() => {
          document.getElementById('commentInput').focus();
        }, 100);
        
        // Scroll into view
        commentBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      function cancelComment() {
        if (activeCommentBox) {
          activeCommentBox.remove();
          activeCommentBox = null;
        }
        document.querySelectorAll('.line-numbered').forEach(el => {
          el.classList.remove('active-comment');
        });
        currentLineNumber = null;
      }
      
      function submitComment() {
        const input = document.getElementById('commentInput');
        const text = input.value.trim();
        
        if (!text || currentLineNumber === null) return;
        
        window.parent.postMessage({
          type: 'addComment',
          lineNumber: currentLineNumber,
          text: text
        }, '*');
        
        cancelComment();
      }
      
      document.addEventListener('click', function(e) {
        const lineEl = e.target.closest('.line-numbered');
        if (lineEl && e.clientX < 60) {
          const lineNumber = parseInt(lineEl.getAttribute('data-line'));
          showCommentBox(lineNumber);
        }
      });
    `;
    doc.body.appendChild(script);

    return doc.documentElement.outerHTML;
  };

  const splitIntoLines = (text: string): string[] => {
    // Split by sentences or at reasonable length
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const lines: string[] = [];
    
    sentences.forEach(sentence => {
      sentence = sentence.trim();
      if (sentence.length <= 200) {
        lines.push(sentence);
      } else {
        // Split long sentences at commas or conjunctions
        const parts = sentence.split(/(?<=,|\sand\s|\sor\s|\sbut\s)/g);
        parts.forEach(part => {
          if (part.trim()) {
            lines.push(part.trim());
          }
        });
      }
    });
    
    return lines;
  };

  const processedHtmlContent = addLineNumbers(htmlContent);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'addComment') {
        const newComment: Comment = {
          id: Date.now().toString(),
          lineNumber: event.data.lineNumber,
          text: event.data.text,
          author: 'Reviewer',
          timestamp: new Date()
        };
        setComments(prev => [...prev, newComment]);
      } else if (event.data.type === 'deleteComment') {
        setComments(prev => prev.filter(c => c.id !== event.data.commentId));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update iframe when comments change
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      // Serialize comments to pass to iframe (convert Date to string)
      const serializedComments = comments.map(c => ({
        ...c,
        timestamp: c.timestamp.toISOString()
      }));
      
      iframeRef.current.contentWindow.postMessage({
        type: 'updateComments',
        comments: serializedComments
      }, '*');
    }
  }, [comments]);

  return (
    <Resizable
      defaultSize={{
        width: '100%',
        height: 600,
      }}
      minWidth={300}
      minHeight={200}
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      handleStyles={{
        right: {
          right: -4,
          width: 8,
          cursor: 'ew-resize',
        },
        bottom: {
          bottom: -4,
          height: 8,
          cursor: 'ns-resize',
        },
        bottomRight: {
          right: -4,
          bottom: -4,
          width: 12,
          height: 12,
          cursor: 'nwse-resize',
        },
      }}
      handleClasses={{
        right: 'hover:bg-blue-400 transition-colors',
        bottom: 'hover:bg-blue-400 transition-colors',
        bottomRight: 'hover:bg-blue-500 transition-colors',
      }}
    >
      <div className="flex flex-col h-full">
        {title && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-2xl font-medium">{title}</h3>
            <button
              onClick={handleOpenInNewTab}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
        <iframe
          ref={iframeRef}
          srcDoc={processedHtmlContent}
          className="w-full flex-1 bg-white"
          title={title || "HTML Viewer"}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </Resizable>
  );
}