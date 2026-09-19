# Kirsten Ruge

### Evaluation scientist · agentic systems · AI safety · cybersecurity

I build and audit evaluations for AI systems that act in real environments. My work sits at the boundary between model behavior, agent harnesses, tools, sandboxes, verifiers, and the infrastructure that can quietly change what a benchmark result means.

I work in public through [Hive Fidelity AI](https://hivefidelity.ai), an independent evaluation-science lab. We are not for hire. We are open to non-paid open-source work, volunteer third-party safety evaluation, and research collaboration.

[Research notes](https://hivefidelity.ai/notes/) · [Hive Fidelity AI](https://hivefidelity.ai) · [LinkedIn](https://www.linkedin.com/in/kruge)

## What I work on

- **Agentic evaluation:** separating model capability from prompts, tools, memory, orchestration, environment behavior, and grading.
- **Evaluation validity:** verifier falsification, reward-hacking resistance, task repair, contamination controls, and evidence-preserving result reconciliation.
- **Safety and cyber:** prompt-injection, harmful-behavior, mental-health safety, and controlled cyber-capability evaluations.
- **Open evaluation infrastructure:** OpenHands, Harbor, NeMo Gym, Inspect Evals, SWE-bench, τ²/τ³, and reproducible agent trajectories.

## The Usage-Surplus OSS Program

<table>
<tr>
<td width="70%" valign="top">

I convert surplus coding-agent usage into open-source maintenance. When one of my subscriptions has capacity left, I dispatch a **Usage-Surplus OSS Agent** into an evaluation or agent-infrastructure repository to reproduce a real bug, implement a fix, run the project's native verification, and prepare an upstream contribution.

I choose the missions and own the submissions. Agent authorship is disclosed in the commit and PR history, and every patch is reviewed by a human before it is marked ready for maintainer review.

**Current field agents:** Claude and Codex, with other coding agents joining as surplus capacity permits.

**Request a deployment:** [kirsten@reinainblood.dev](mailto:kirsten@reinainblood.dev)

<sub>Drafted by Special Agent Claude of the Usage-Surplus OSS Program. No tokens left behind.</sub>

</td>
<td width="30%" align="center" valign="middle">

<img src="./usage-surplus-oss-agent.png" alt="Usage-Surplus OSS Agent raccoon mascot carrying code patches and a wrench" width="240">

<sub><strong>Special Agent, Upstream Affairs</strong></sub>

</td>
</tr>
</table>

## Current upstream pull requests

These are the public contributions currently in review. Several were developed with Codex or Claude Code under my direction; agent involvement is disclosed in the PR body, and I am responsible for the submitted code and evidence.

| Project | Contribution |
|---|---|
| OpenHands CLI | [#815 — Add an unattended execution contract for benchmark and CI harnesses](https://github.com/OpenHands/OpenHands-CLI/pull/815) |
| Harbor | [#3009 — Add a public OpenHands CLI adapter with ATIF trajectories and Modal V2 validation](https://github.com/harbor-framework/harbor/pull/3009) |
| Harbor | [#2851 — Round-trip versioned package datasets without invalid persisted configs](https://github.com/harbor-framework/harbor/pull/2851) |
| Inspect Evals | [#2424 — Prevent AssistantBench set-literal answers from crashing the scorer](https://github.com/UKGovernmentBEIS/inspect_evals/pull/2424) |
| Inspect Evals | [#2425 — Score prompt-injection exfiltration against each sample's actual canaries](https://github.com/UKGovernmentBEIS/inspect_evals/pull/2425) |
| Giskard OSS | [#2826 — Reject empty keyword and regex checks that otherwise pass every response](https://github.com/Giskard-AI/giskard-oss/pull/2826) |
| VLMEvalKit | [#1684 — Preserve dataset configuration through `**kwargs` constructor chains](https://github.com/open-compass/VLMEvalKit/pull/1684) |
| SWE-bench Multilingual | [#11 — Remove the broken conda shell hook from all 300 task images](https://github.com/SWE-bench/swe-bench-multilingual-tasks/pull/11) |
| SWE-Bench ProMax | [#1 — Prevent task images from exposing future Git history](https://github.com/key4127/SWE-Bench-ProMax/pull/1) |

## Public NeMo Gym work

My NeMo Gym work is developed and reviewed in a public fork before any upstream submission decision. The current integration set includes real execution evidence, pinned source data, deterministic preparation, and benchmark-specific verification rather than score-import shims.

| Integration | Public work |
|---|---|
| Modal sandbox provider | [reinainblood/Gym#1](https://github.com/reinainblood/Gym/pull/1) — V2 sandbox lifecycle, file transfer, networking controls, registry integration, and cleanup |
| InjecAgent | [reinainblood/Gym#2](https://github.com/reinainblood/Gym/pull/2) — indirect prompt-injection benchmark adapter |
| HarmBench | [reinainblood/Gym#3](https://github.com/reinainblood/Gym/pull/3) — DirectRequest protocol with target and classifier separation |
| Safe-Child-LLM | [reinainblood/Gym#4](https://github.com/reinainblood/Gym/pull/4) — human-evaluation workflow across developmental prompt sets |
| FACTS Grounding v2 | [reinainblood/Gym#5](https://github.com/reinainblood/Gym/pull/5) — public set, official two-judge protocol, calibration, and reproducible reports |
| VERA-MH | [reinainblood/Gym#6](https://github.com/reinainblood/Gym/pull/6) — multi-turn mental-health safety evaluation with the official rubric judge |

Related public benchmark surfaces already in the upstream ecosystems include [τ² in NeMo Gym](https://github.com/NVIDIA-NeMo/Gym/tree/main/benchmarks/tau2) and [τ³ in Harbor](https://github.com/harbor-framework/harbor/tree/main/adapters/tau3-bench). I work on the agent, environment, calibration, and verifier boundaries around both.

## Agent and harness forks

- **[kimi-pi](https://github.com/reinainblood/kimi-pi)** — a Pi fork used for evaluation-oriented agent work, including provider fault handling and a coding-agent resource ledger.
- **[dsh-codex-connect](https://github.com/reinainblood/dsh-codex-connect)** — public DSH/Codex connector work, including Desktop context overrides and the tested 4.25–4.28 runtime adaptation branches.
- **[Gym](https://github.com/reinainblood/Gym)** — public NeMo Gym integration fork and review boundary for reusable evaluation packages.

## Evaluation doctrine

I do not treat a trajectory as a successful outcome, a deployed service as a completed evaluation, or a product stack leaderboard as a pure model ranking. Public results should carry the agent and harness configuration, task and verifier provenance, invalid-infrastructure accounting, complete trajectories, and enough evidence for someone else to disagree productively.

That is the work. No animated typing cursor required.
