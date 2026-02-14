# Puppet Master - Game Design Document

## 1. Overview

### 1.1 Game Title
Puppet Master

### 1.2 Genre
Physics-based ragdoll sandbox game

### 1.3 Platform
Mobile-first (iOS/Android), with potential PC port

### 1.4 Target Audience
Casual gamers seeking stress relief and dark humor entertainment

## 2. Core Concept

### 2.1 Premise
Players take on the role of an invisible "Puppet Master" controlling a cloth puppet through physics manipulation rather than direct movement. The game focuses on chaotic, unpredictable reactions and dark-humored interactions.

### 2.2 Unique Selling Points
- Fully physics-driven ragdoll system
- Exaggerated and chaotic reactions
- Dark-humored but non-violent interactions
- Sandbox-style freeform gameplay

## 3. Visual Style

### 3.1 Art Direction
- 3D cartoon/stylized graphics
- Burlap/voodoo doll aesthetic for puppet
- Wooden plank environment
- Creepy but humorous atmosphere
- No realistic gore or blood

### 3.2 Character Design
- Puppet made of burlap/fabric materials
- Stitched smile and button/X-shaped eyes
- Clearly defined body parts (head, torso, limbs)

## 4. Core Mechanics

### 4.1 Puppet System
- 6-body-part ragdoll (head, torso, 4 limbs)
- Each part is a separate rigidbody
- Connected via configurable joints
- High elasticity settings for exaggerated movement

### 4.2 Player Interaction
- Drag/pull puppet limbs
- Apply directional forces
- Throw/push puppet
- Pin puppet to surfaces
- Use various tools/weapons

### 4.3 Physics System
- Real-time ragdoll physics simulation
- Strong gravity interactions
- Elastic joint constraints for chaotic movement
- Force application with variable intensity

## 5. Tools & Weapons

### 5.1 Basic Tools
- Knife (for cutting/fabric tearing)
- Hammer (blunt force)
- Nail/Gun (projectile force)
- Rope (constraint tool)

### 5.2 Advanced Tools
- Fire effect (stylized burning)
- Electricity (shock effects)
- Magnet (attraction/repulsion)
- Wind (area force)

## 6. Damage & Reaction System

### 6.1 Visual Feedback
- Fabric tearing animations
- Stitch damage indicators
- Hole formation in cloth
- Expression changes

### 6.2 Audio Feedback
- Cloth tearing sounds
- Impact sounds
- Cartoon scream effects

### 6.3 Physics Response
- Temporary ragdoll collapse
- Limb detachment (temporary)
- Exaggerated flailing

## 7. Camera System

### 7.1 Camera Type
- Fixed top-down or slight angle
- Smooth zoom functionality
- Impact-triggered camera shake

## 8. UI/UX Design

### 8.1 Interface Elements
- Minimal HUD
- Tool selection panel
- Reset button
- Slow-motion toggle
- Score display (in challenge modes)

### 8.2 Controls
- Touch/drag for limb manipulation
- Tap for tool activation
- Pinch to zoom
- Swipe for camera rotation (optional)

## 9. Game Modes

### 9.1 Sandbox Mode
- Unlimited interaction
- No scoring system
- Focus on experimentation

### 9.2 Challenge Mode
- Specific objectives
- Scoring system
- Time limits

## 10. Scoring System

### 10.1 Point Categories
- Creative interactions
- Air time achievements
- Chain reactions
- Environmental utilization

## 11. Audio Design

### 11.1 Sound Effects
- Cloth/material sounds
- Impact audio
- Puppet reaction sounds
- Tool interaction sounds

### 11.2 Music
- Dark, playful background tracks
- Dynamic intensity based on action level

## 12. Technical Requirements

### 12.1 Performance Targets
- 60 FPS on mid-range mobile devices
- Optimized physics calculations
- Efficient memory usage

### 12.2 Development Platform
- Unity 3D engine
- C# scripting
- Mobile-first optimization

## 13. Ethical Considerations

### 13.1 Content Guidelines
- Non-realistic, cartoon violence
- Focus on abstract interaction over harm
- Humorous rather than disturbing tone
- Clear fictional context

## 14. Implementation Roadmap

### Phase 1: Core Systems
- Basic ragdoll physics
- Simple puppet model
- Basic force application

### Phase 2: Tools & Interaction
- Tool selection system
- Various interaction methods
- Damage feedback

### Phase 3: Polish & Expansion
- Visual effects
- Audio integration
- Additional tools and challenges