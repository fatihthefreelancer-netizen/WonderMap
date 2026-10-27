# How We Build Learning Experiences

## Purpose

This document explains how we turn a real-life skill into a short, interactive learning experience for children. The goal is for a collaborator to be able to design and build new **worlds, chapters, and experiences independently**, while following the same educational and product approach.

The product is not just a collection of explanations or quizzes. Children should learn by **experiencing ideas, making decisions, seeing consequences, and practising useful behaviours**.

## The workflow at a glance

1. **Define the outcomes** — what children should know and be able to do.
2. **Design the learning journey** — the order in which they should learn it.
3. **Break the journey into chapters** — one or two core ideas per short experience.
4. **Design the interaction** — how the child will experience and practise each idea.
5. **Write the implementation specification** — turn the agreed concept into precise instructions for development.
6. **Plan and generate the visuals** — create the characters, objects, and backgrounds the experience needs.
7. **Build, test, and refine** — use AI-assisted coding, try the experience, and iterate until it meets the intended standard.

Each stage should be clear enough to guide the next one. Avoid jumping straight into screens, illustrations, or code before the learning goal and experience structure are understood.

---

## 1. Define the learning outcomes first

Start with the real-life skill, not with an activity or a visual idea.

For the topic in scope, define two kinds of outcomes:

- **Knowledge:** What should the child understand by the end?
- **Behaviours:** What should the child be more likely to do in a real situation?

Make the outcomes concrete and observable. “Understand money” is too broad. An outcome such as “recognise that money helps people exchange things without needing to barter directly” is more useful. A behavioural outcome might be “compare options before spending limited money.”

Ask:
- What should the child know or understand?
- What should the child be able to decide, explain, or do?
- In which real-life situation would this knowledge or behaviour be useful?
- What would show us that the child has learned it?

**Deliverable:** A concise list of learning outcomes, separated into knowledge and behaviours.

## 2. Build the learning journey

Once the outcomes are clear, decide how to teach them in a sensible sequence. Create a progression: what must the child understand first, what comes next, and how does each idea prepare them for the next?

Think in terms of a learning path, not a list of disconnected facts. Keep the journey focused on the outcomes defined in Step 1. Avoid adding material just because it is related to the topic.

**Deliverable:** An ordered outline of the concepts or lessons, with a brief explanation of why that order makes sense.

## 3. Divide the journey into chapters

Break the learning journey into short chapters. A typical chapter is about **four minutes** long, although the right length depends on the experience.

Each chapter should focus on **one or two main ideas**. If a chapter is trying to teach too many things, simplify it or split it into multiple chapters.

For each chapter, define:
- **Chapter goal:** What should the child take away from this experience?
- **Core idea(s):** The one or two things the experience focuses on.
- **Connection to the journey:** What came before, and what will this prepare the child for?
- **Evidence of learning:** What choice, action, explanation, or response would show understanding?

**Deliverable:** A chapter-by-chapter outline with a clear goal for every chapter.

## 4. Design the experience before writing code

For each core idea, decide how the child should learn it through interaction. The aim is not simply to tell the child the answer, but to create an experience in which they can discover, apply, or practise the idea.

Consider interactive, gamified, and immersive formats such as:
- Making a choice between options and seeing the consequences.
- Solving a practical problem.
- Moving, sorting, matching, or assembling objects.
- Helping a character through a situation.
- Trying an action, receiving feedback, and trying again.
- Exploring a simple simulation of a real-life situation.

Choose the interaction because it serves the learning goal—not just because it looks fun. The child should have an active role, and the experience should make the intended idea understandable.

For each chapter, clarify:
- **Scenario:** What is happening, and why should the child care?
- **Child's role:** Who are they, and what are they trying to do?
- **Interaction:** What can the child click, choose, move, create, or try?
- **Feedback and consequences:** How does the experience respond to the child's actions?
- **Learning moment:** How does the interaction reveal or reinforce the core idea?
- **Completion:** What happens when the child finishes?

Keep the experience age-appropriate, easy to understand, and focused. Do not add mechanics, dialogue, or decorative elements that distract from the learning goal.

**Deliverable:** An agreed experience skeleton: the sequence of scenes or steps, what the child does, and what each step teaches.

## 5. Turn the skeleton into a developer-ready specification

Once the educational structure and interaction are clear, use a generative AI assistant (for example, Claude) to turn the skeleton into a detailed implementation specification.

The specification should remove ambiguity for the developer. It should describe the intended experience, not leave important product decisions to be guessed during coding.

Depending on the experience, include:
- Learning objectives and target age.
- Scene-by-scene flow and transitions.
- All on-screen text, dialogue, instructions, and feedback.
- User actions and the response to each action.
- Rules, states, conditions, scoring, and completion logic, where relevant.
- Layout and interaction requirements.
- Visual assets needed and how each should be used.
- Edge cases, incorrect answers, retries, and what happens when the child gets stuck.
- Any missing details needed to implement the experience consistently.

Review the specification critically. Ask the AI to identify ambiguities, missing states, unclear instructions, and unanswered implementation questions. Fill the gaps and revise the document until the experience is sufficiently precise to build.

**Important:** AI can help structure and complete the specification, but it should not silently invent educational goals or change the agreed experience. Review its suggestions and make the decisions deliberately.

**Deliverable:** A reviewed, implementation-ready specification that can be handed to a coding assistant or developer.

## 6. Plan and generate the visual assets

Once the specification is stable, ask the AI assistant to produce a **visual asset inventory**. Request the assets needed for the experience and the variations required for each asset.

For example, a character might need:
- A neutral expression.
- A thinking expression.
- A happy expression.

Other assets might include objects the child interacts with (such as a pizza, football, or sun), icons, props, or a background suited to the scene and the topic.

For each asset, specify its purpose and any important requirements, such as:
- Required expression or pose.
- Whether it must have a transparent background.
- Approximate style, proportions, and visual consistency.
- Whether it must be readable at small sizes.
- Whether several states or variants are needed.
- Where it appears in the experience.

### Generate assets efficiently

To reduce the number of image-generation prompts, **group related visuals into a single image when practical**. For example, generate several expressions of the same character together, or arrange multiple separate objects in one image, on a transparent background.

The coding assistant can then crop the image into individual assets and use the relevant variant in the application. Make the layout clear enough that the assets can be separated cleanly. Avoid overlapping elements, clipped edges, shadows that merge into neighbouring objects, or inconsistent scale unless intentional.

Generate backgrounds separately when the experience benefits from a specific setting, atmosphere, or theme. A background should support the interaction and keep important content legible; it should not compete with the interactive elements.

Before implementation, check that:
- Every required asset in the specification exists.
- Character and object styles are consistent.
- Variants are clearly distinguishable.
- Assets have suitable backgrounds and clean edges.
- Backgrounds leave enough visual space for the interface and text.

**Deliverable:** An organised set of visual assets, plus a clear mapping between each asset and its intended use in the specification.

## 7. Build the experience with AI-assisted coding

Give the coding assistant the reviewed specification and the generated assets. Ask it to implement the experience according to those materials rather than improvising a new design.

The handoff should make clear:
- Which specification is the source of truth.
- Where the visual assets are stored and which asset corresponds to each use.
- Which behaviours and interactions must work.
- What must not be changed without agreement.

If the assistant encounters a genuine ambiguity, resolve it instead of letting it make a consequential assumption. Small implementation details can be handled pragmatically, but educational logic, interaction flow, and visual direction should remain aligned with the specification.

**Deliverable:** A working version of the experience that follows the specification.

## 8. Test, experience, and refine

Treat the first implementation as a draft, not a finished product. Run through the experience as a child would and check both the learning and the product quality.

Check that:
- The intended idea is understandable without unnecessary explanation.
- The child is doing something meaningful, not just reading or clicking through.
- Choices produce the expected feedback and consequences.
- Instructions, transitions, and completion states are clear.
- The pacing fits the intended short experience.
- Text is readable and age-appropriate.
- Visuals, layout, and interactions work together.
- There are no broken states, dead ends, or obvious technical issues.

Then refine the implementation. Give the coding assistant specific feedback, test the changes, and repeat until the experience meets the intended standard. Where possible, check whether the child can demonstrate the target knowledge or behaviour, rather than judging the experience only by how polished or entertaining it looks.

**Deliverable:** A tested and refined learning experience that achieves its defined goals.

---

## Principles to keep in mind

1. **Learning outcomes come first.** Start with the knowledge and behaviours we want to develop—not with a game mechanic or a visual.
2. **Every chapter has a focus.** Aim for one or two core ideas in a short experience.
3. **Interaction serves learning.** Gamification and immersion should help children understand, decide, and practise.
4. **Specify before building.** Agree on the learning flow and clarify the details before generating code.
5. **Visuals have a purpose.** Each asset should support the scene, interaction, or emotional tone.
6. **Use AI as a collaborator, not as the decision-maker.** It can draft, identify gaps, generate assets, and code, but educational and product decisions must be reviewed.
7. **Test the actual experience.** A good specification or attractive screen does not guarantee a good learning experience.
8. **Keep the process reproducible.** Organise the outcomes, chapter outlines, specifications, and assets so another collaborator can continue the work without needing the original designer at every step.

## What to hand over for each new chapter

Before asking someone to implement a chapter, make sure the following are available:

- [ ] The relevant learning outcomes (knowledge and behaviours).
- [ ] The chapter's place in the overall learning journey.
- [ ] The chapter goal and one or two core ideas.
- [ ] The agreed interactive experience skeleton.
- [ ] The reviewed developer-ready specification.
- [ ] The visual asset inventory and generated assets.
- [ ] Clear notes mapping assets to their intended use.
- [ ] A test pass with issues and refinements documented.

A collaborator should be able to use these materials to continue the process independently, while preserving the same educational intent and product quality.
