<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

<!-- OPENSPEC-BEADS:START -->
## Development Workflow: OpenSpec + Beads

### Planning Phase (OpenSpec)
- Use `/openspec:proposal` to create change proposals
- Iterate on specs until human approves
- Do NOT use `/openspec:apply` — we use Beads for execution

### Execution Phase (Beads)
After human approves the proposal:
1. Seed Beads: Create epic + tasks from tasks.md with dependencies
2. Freeze tasks.md: Never query it for "what's next" after seeding
3. Execute via `bd ready --json` only
4. Close issues as work completes
5. File discovered work immediately with `bd create` + `discovered-from` link

### Session Protocol
- Start: `bd ready --json` to find unblocked work
- During: Update status, close completed, file discoveries
- End: `bd sync && git push` — mandatory before ending

### Archive Phase
When all Beads issues for a change are closed:
1. Update tasks.md checkboxes to match Beads (for archive completeness)
2. Run `openspec archive <change-name> --yes`

### Critical Rules
- Beads is the ONLY source of truth for execution status
- tasks.md is frozen reference after seeding — read-only
- Always `bd sync && git push` before ending any session
- Include Beads ID in commits: `git commit -m "Add feature (bd-a1b2)"`




<!-- OPENSPEC-BEADS:END -->

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds


## Mandatory Frontend Testing
When you finish working on a bug, feature, setup, any code edit, before declaring that all is working perfectly, use **claude in chrome** or **crhrome dev tools mcp** and check the console log for any errors while testing every UI element on every route that might be affected by what you have been working on. Examples: test searchbox work whith actual typing a sample search term and get correct results, all charts populated, every UI interractivity feature works (hover, linked charts, tooltip), test table pagination, links work and take you where they should. After checking console log, check server logs and fix every error if exists. Fix any error until no errors exist. Only then declare a task successfully complete.