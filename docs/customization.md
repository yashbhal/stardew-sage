# Customization Guide

## Overview

Stardew Sage is designed to be highly customizable, allowing you to adapt its appearance, behavior, and functionality to your preferences. This guide covers the various ways you can customize the application.

## Table of Contents

- [Visual Customization](#visual-customization)
  - [Theme Colors](#theme-colors)
  - [Typography](#typography)
  - [UI Elements](#ui-elements)
- [Functional Customization](#functional-customization)
  - [AI Model](#ai-model)
  - [Initial Messages](#initial-messages)
  - [Response Formatting](#response-formatting)
- [Advanced Customization](#advanced-customization)
  - [Adding New Features](#adding-new-features)
  - [Extending the API](#extending-the-api)
  - [Performance Optimizations](#performance-optimizations)

## Visual Customization

### Theme Colors

Stardew Sage uses a custom color palette defined in `tailwind.config.js`. You can modify these colors to match your preferred aesthetic:

```javascript
colors: {
  // Main palette - Core colors used throughout the game
  'stardew-blue': {
    50: '#E6F4F9',
    100: '#C0E3F0',
    200: '#8ECAE6', // light
    300: '#5FB0D3',
    400: '#219EBC', // default
    500: '#1A7D96',
    600: '#126782', // dark
    700: '#0D4F64',
    800: '#083746',
    900: '#041E28',
  },
  // ... other color definitions
}
```

To change the overall color scheme:

1. Modify the color values in `tailwind.config.js`
2. Use a color palette generator like [Coolors](https://coolors.co/) to create harmonious color schemes
3. Update the gradient definitions for elements like the header

### Typography

The application uses custom font settings that you can modify:

```javascript
fontFamily: {
  'pixel': ['VT323', 'monospace', 'ui-monospace'],
  'stardew': ['Stardew', 'serif', 'ui-serif'],
  'body': ['Inter', 'system-ui', 'sans-serif'],
},
```

To use different fonts:

1. Import your preferred fonts in `src/app/globals.css`
2. Update the font family definitions in `tailwind.config.js`
3. Adjust the font sizes and line heights if needed

### UI Elements

#### Message Bubbles

You can customize the appearance of message bubbles in `ChatInterface.tsx`:

```jsx
<div 
  className={`
    max-w-[80%] sm:max-w-[70%] rounded-stardew-lg p-3 shadow-stardew-sm
    ${isUser 
      ? 'bg-stardew-blue-400 text-white rounded-tr-none' 
      : 'bg-menu-paper border border-menu-border rounded-tl-none'
    }
  `}
>
  {/* Message content */}
</div>
```

To change the bubble style:
- Modify the background colors (`bg-stardew-blue-400`, `bg-menu-paper`)
- Adjust the border radius (`rounded-stardew-lg`, `rounded-tr-none`, `rounded-tl-none`)
- Change the shadow effect (`shadow-stardew-sm`)

#### Header

The header appearance can be customized in `ChatInterface.tsx`:

```jsx
<div className="bg-gradient-to-r from-stardew-green-500 to-stardew-green-600 p-3 sm:p-4 text-white flex items-center justify-between border-b-2 border-menu-border">
  {/* Header content */}
</div>
```

To change the header style:
- Modify the gradient colors (`from-stardew-green-500 to-stardew-green-600`)
- Adjust the padding (`p-3 sm:p-4`)
- Change the border (`border-b-2 border-menu-border`)

#### Avatars

You can customize the avatar images and their containers:

```jsx
<div className="w-10 h-10 rounded-full bg-menu-paper border-2 border-menu-border shadow-stardew-sm overflow-hidden relative">
  <Image 
    src="/icons/stardew-sage.jpg" 
    alt="Stardew Sage" 
    width={40}
    height={40}
    className="object-cover"
  />
</div>
```

To change the avatar style:
- Replace the image files in the `public/icons` directory
- Adjust the container size (`w-10 h-10`)
- Modify the border and background (`border-2 border-menu-border bg-menu-paper`)

## Functional Customization

### AI Model

By default, Stardew Sage uses Google's Gemini 1.5 Flash model. You can switch to a different model by modifying the API integration. See the [API Integration Guide](./api-integration.md) for detailed instructions.

### Initial Messages

You can customize the initial welcome message in `ChatInterface.tsx`:

```javascript
const [messages, setMessages] = useState<Message[]>([
  {
    role: 'assistant',
    content: "Hi there! I'm Stardew Sage, your friendly Stardew Valley assistant. Ask me anything about crops, villagers, fishing, mining, or any other aspect of the game!",
    timestamp: new Date(),
  },
]);
```

To change the welcome message:
- Modify the content text
- Add multiple initial messages if desired
- Include markdown formatting for rich text

### Response Formatting

You can customize how the AI formats its responses by modifying the prompt in `src/app/api/chat/route.ts`. See the [API Integration Guide](./api-integration.md#prompt-engineering) for details.

## Advanced Customization

### Adding New Features

#### Message History Persistence

To add message history persistence:

1. Add a state management library like Redux or use browser localStorage:

```javascript
// Save messages to localStorage
useEffect(() => {
  if (messages.length > 1) {
    localStorage.setItem('stardewSageChat', JSON.stringify(messages));
  }
}, [messages]);

// Load messages from localStorage on component mount
useEffect(() => {
  const savedMessages = localStorage.getItem('stardewSageChat');
  if (savedMessages) {
    try {
      const parsedMessages = JSON.parse(savedMessages);
      setMessages(parsedMessages);
    } catch (e) {
      console.error('Failed to parse saved messages', e);
    }
  }
}, []);
```

#### Voice Input/Output

To add voice capabilities:

1. Use the Web Speech API for voice input:

```javascript
const startVoiceInput = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
  };
  
  recognition.start();
};
```

2. Add a microphone button to the UI:

```jsx
<button
  type="button"
  onClick={startVoiceInput}
  className="p-2 rounded-full bg-stardew-green-500 text-white"
  aria-label="Voice input"
>
  <MicrophoneIcon className="h-5 w-5" />
</button>
```

### Extending the API

#### Adding Context Memory

To give the AI more context about previous messages:

1. Modify the API route to include previous messages in the prompt:

```javascript
// In src/app/api/chat/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, history } = body;
  
  // Format history as context
  const conversationHistory = history
    .map(msg => `${msg.role === 'user' ? 'User' : 'Stardew Sage'}: ${msg.content}`)
    .join('\n');
  
  const prompt = `
    # Conversation History
    ${conversationHistory}
    
    # You are Stardew Sage
    // ... rest of the prompt ...
  `;
  
  // Call AI API with the enhanced prompt
}
```

2. Update the ChatInterface to send message history:

```javascript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // ... existing code ...
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: input,
        history: messages.slice(-5) // Send last 5 messages for context
      }),
    });
    
    // ... rest of the function ...
  }
};
```

### Performance Optimizations

#### Message Virtualization

For better performance with long conversations, implement virtualized lists:

1. Install a virtualization library:

```bash
npm install react-window
```

2. Implement virtualized message rendering:

```jsx
import { FixedSizeList as List } from 'react-window';

// In the ChatInterface component
const MessageList = ({ messages }) => {
  const Row = ({ index, style }) => {
    const message = messages[index];
    return (
      <div style={style}>
        {renderMessage(message, index)}
      </div>
    );
  };

  return (
    <List
      height={500}
      itemCount={messages.length}
      itemSize={100} // Approximate height of each message
      width="100%"
    >
      {Row}
    </List>
  );
};

// Use in the component
<div ref={chatContainerRef} className="flex-1 p-3 sm:p-4 overflow-y-auto">
  <MessageList messages={messages} />
</div>
```

#### Debounced Input

To prevent excessive re-renders during typing:

1. Implement debounced input handling:

```javascript
import { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

// In the ChatInterface component
const [inputValue, setInputValue] = useState('');
const [debouncedInput, setDebouncedInput] = useState('');

const debouncedSetInput = useCallback(
  debounce((value) => {
    setDebouncedInput(value);
  }, 300),
  []
);

const handleInputChange = (e) => {
  const value = e.target.value;
  setInputValue(value);
  debouncedSetInput(value);
};

// Use debouncedInput for any expensive operations
```

## Conclusion

Stardew Sage offers extensive customization options to tailor the application to your needs. Whether you want to change the visual appearance, modify the AI behavior, or add new features, the modular architecture makes it straightforward to implement your changes.

For more specific customization needs, refer to the other documentation files:

- [Chat Interface Documentation](./chat-interface.md)
- [API Integration Guide](./api-integration.md) 