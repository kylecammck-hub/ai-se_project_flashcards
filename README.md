# Flash Card App

A responsive web application for creating and studying flash card decks.

## Features

### Home View
- Displays all saved flash card decks as colored cards
- Each deck shows the deck title and number of cards
- Decks can be deleted using the trash icon

### Open Deck View
- Browse cards in a deck one at a time using a carousel
- Flip cards to reveal the answer
- Add new cards to the deck
- Start a practice session

### New Deck Creation
- Create a new deck by submitting a name, color, and cards as JSON through a form
- Client-side validation checks the JSON structure, deck name, and selected color before submitting
- Newly created decks are saved and the app navigates directly to the new deck

### Confirmation Modal
- Prompts the user to confirm before deleting a deck
- Prevents accidental data loss

### Error Handling
- Invalid form input or failed API requests display a descriptive error message in a modal dialog
- The error modal can be dismissed without disrupting the rest of the app

### Responsive Design
- Fully responsive layout optimized for mobile screens (390px)
- Fixed mobile navigation bar with a "+ New Deck" button
- Fixed footer that stays at the bottom of the screen
- Deck cards adapt to full-width with a preserved aspect ratio on mobile
- Carousel layout switches to a CSS grid on mobile for better usability
- Box shadows applied to deck cards and carousel elements

## Data & API
- All decks and cards are persisted in a remote database, accessed through a dedicated flashcards REST API
- Fetch-based requests handle retrieving, creating, updating, and deleting decks and cards
- API errors are caught and surfaced to the user through the error modal

## Documentation
- All JavaScript modules are documented with JSDoc comments describing function parameters, return values, and behavior
