import { useState, useEffect, useRef } from 'react';

const terribleCodeBlocks = [
  `// JavaScript - Production Ready Code™
function calculateTotal(items) {
  // TODO: implement proper logic here
  let total = 0;
  total = total + items[0].price;
  total = total + items[1].price;
  total = total + items[2].price;
  total = total + items[3].price;
  // TODO: make this work for more than 4 items
  if (items.length > 4) {
    total = total + items[4].price;
  }
  if (items.length > 5) {
    total = total + items[5].price;
  }
  // TODO: figure out why we need this
  return total + 0.0000000001; // placeholder fix
}

const API_KEY = "YOUR_API_KEY_HERE"; // TODO: add real key
const PASSWORD = "PLACEHOLDER_PASSWORD"; // TODO: update this
const DB_HOST = "localhost"; // TODO: change to production

// TODO: refactor this entire file`,

  `# Python - Definitely Works On My Machine
def process_user_data(user):
    # TODO: add actual validation
    if user == None:
        return None
    if user == "":
        return None
    if user == " ":
        return None
    if user == "  ":
        return None
    # TODO: there's probably a better way to do this
    
    # TODO: implement real sanitization
    email = user.lower()
    
    # TODO: use actual regex validation
    if "@" in email:
        valid = True
    else:
        valid = False
    
    if valid == True:
        # TODO: connect to real email service
        send_email("placeholder@example.com", email)
        return True
    elif valid == False:
        return False
    
    # placeholder return value
    return "TODO: handle edge cases"

# NOTE: This is just placeholder code`,

  `// Java - Enterprise Grade Solution
public class UserService {
    // TODO: Add proper documentation
    
    public String processData(String data) {
        String result = ""; // placeholder
        
        // TODO: replace with actual database lookup
        for (int i = 0; i < 1; i++) {
            // TODO: use HashMap instead
            if (data.equals("user1")) {
                result = "John"; // placeholder name
            }
            if (data.equals("user2")) {
                result = "Jane"; // placeholder name
            }
            if (data.equals("user3")) {
                result = "Bob"; // placeholder name
            }
            // TODO: add more users from database
        }
        
        // TODO: investigate why this is necessary
        try {
            Thread.sleep(100); // placeholder delay
        } catch (Exception e) {
            // TODO: proper error handling
        }
        
        return result; // TODO: format properly
    }
    
    // TODO: move to config file
    private static final String SECRET = "PLACEHOLDER_SECRET";
}`
];

export default function App() {
  const [displayText, setDisplayText] = useState('');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isTypingTodo, setIsTypingTodo] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isComplete) return; // Stop if we've completed all blocks
    
    const currentBlock = terribleCodeBlocks[currentBlockIndex];
    
    if (!isCommenting && !isTypingTodo) {
      // Type out the current terrible code block
      if (charIndexRef.current < currentBlock.length) {
        const delay = Math.random() * 50 + 10; // Variable typing speed
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentBlock.slice(0, charIndexRef.current + 1));
          charIndexRef.current++;
        }, delay);
      } else {
        // Wait a bit before commenting out
        timeoutRef.current = setTimeout(() => {
          setIsCommenting(true);
        }, 1500);
      }
    } else if (isCommenting) {
      // Comment out all the code
      const lines = displayText.split('\n');
      const allCommented = lines.every(line => line.startsWith('// '));
      
      if (!allCommented) {
        const delay = 30;
        timeoutRef.current = setTimeout(() => {
          const newLines = lines.map((line, idx) => {
            if (idx < Math.ceil(lines.length * (charIndexRef.current / 100))) {
              return line.startsWith('// ') ? line : '// ' + line;
            }
            return line;
          });
          setDisplayText(newLines.join('\n'));
          charIndexRef.current += 5;
        }, delay);
      } else {
        // Start typing the todo comment
        setIsTypingTodo(true);
        setDisplayText('');
        charIndexRef.current = 0;
      }
    } else if (isTypingTodo) {
      const todoText = '// todo: replace with your code';
      
      if (charIndexRef.current < todoText.length) {
        const delay = 80;
        timeoutRef.current = setTimeout(() => {
          setDisplayText(todoText.slice(0, charIndexRef.current + 1));
          charIndexRef.current++;
        }, delay);
      } else {
        // Wait before moving to next block or completing
        timeoutRef.current = setTimeout(() => {
          if (currentBlockIndex < terribleCodeBlocks.length - 1) {
            // Move to next block
            setCurrentBlockIndex(currentBlockIndex + 1);
            setDisplayText('');
            setIsCommenting(false);
            setIsTypingTodo(false);
            charIndexRef.current = 0;
          } else {
            // We've finished all blocks, stay here
            setIsComplete(true);
          }
        }, 2000);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, currentBlockIndex, isCommenting, isTypingTodo, isComplete]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Terminal Header */}
        <div className="bg-[#f5f5f5] rounded-t-lg px-4 py-3 flex items-center gap-2 border border-gray-300">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          <span className="ml-4 text-sm text-gray-600 font-mono">
            totally_professional_code.{currentBlockIndex === 0 ? 'js' : currentBlockIndex === 1 ? 'py' : 'java'}
          </span>
        </div>
        
        {/* Terminal Body */}
        <div className="bg-white rounded-b-lg p-6 min-h-[500px] border border-gray-300 border-t-0">
          <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
            {displayText}
            <span className="inline-block w-2 h-4 bg-gray-800 ml-0.5 animate-pulse"></span>
          </pre>
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500 font-mono">
          <span>
            {isTypingTodo ? '💭 giving up...' : isCommenting ? '🗑️ deleting evidence...' : '⌨️ coding with AI...'}
          </span>
          <span>Block {currentBlockIndex + 1}/{terribleCodeBlocks.length}</span>
        </div>
      </div>
    </div>
  );
}