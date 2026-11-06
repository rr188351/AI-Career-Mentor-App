# AI Career Mentor — UI Implementation Notes

This file records UI details verified from the application source. It is not a substitute for research evidence.

## Implemented screens

Splash, Welcome, Login, Create Account, Career Stage, Interests and Skills, Goals, Career Assessment, Assessment Results, Home Dashboard, Career Exploration, Career Details, Career Comparison, AI Mentor Chat, Career Roadmap, Progress Tracker, Notifications, Profile, and Settings.

## Verified design tokens

- Dark background: `#080B14`
- Secondary dark background: `#0D1220`
- Elevated dark surface: `#121A2B`
- Primary cyan: `#63E8FF`
- Electric blue: `#6488FF`
- AI violet: `#A58BFF`
- Main dark-theme text: `#F5F7FF`
- Secondary dark-theme text: `#B1BBCF`
- Success: `#6DE7B2`
- Warning: `#FFC978`
- Error: `#FF7F93`
- Light background: `#F5F7FB`
- Light text: `#182235`
- Light primary accent: `#087EA4`
- Light secondary accent: `#6554C0`

Typography uses Inter. Cards use 17–22 px radii, one-pixel translucent borders, restrained blur, inner highlights, and low-intensity cyan/violet illumination.

## Implemented interaction and motion

- Splash logo, title, and tagline entrance
- Screen and dashboard staggered entrances
- AI orb float and light cycle
- Career match fill and progress animation
- Save-state confirmation pop
- Bottom-navigation active feedback
- Staggered roadmap milestones
- Selection feedback for chips, cards, and answers
- Chat message entrance and typing indicator
- Dark/light theme transition
- `prefers-reduced-motion` handling

## Implementation boundaries

The application is a frontend prototype. Google authentication, production AI, server-side persistence, and email are not connected. User preferences are stored locally in the browser.
