# Chat Interface Documentation

## Overview

The `ChatInterface` component is the core of the Stardew Sage application. It provides a responsive, user-friendly interface for interacting with the AI assistant, handling message display, user input, API communication, and state management.

![Chat Interface Screenshot](../public/icons/stardew-sage.jpg)

## Features

- **Real-time Chat**: Displays messages in a conversational format with user and assistant avatars
- **Markdown Support**: Renders assistant responses with rich formatting using ReactMarkdown
- **Responsive Design**: Adapts to different screen sizes from mobile to desktop
- **Loading States**: Shows animated loading indicators during API requests
- **Error Handling**: Displays user-friendly error messages when issues occur
- **Auto-scrolling**: Automatically scrolls to the newest message
- **Timestamps**: Shows the time each message was sent

## Component Structure

The `ChatInterface` component is structured as follows:

```
ChatInterface
├── State Management (useState, useRef, useEffect)
├── API Communication (handleSubmit function)
├── Message Rendering (renderMessage function)
├── UI Components
│   ├── Header
│   ├── Messages Container
│   │   ├── User Messages
│   │   ├── Assistant Messages
│   │   ├── Loading Indicator
│   │   └── Error Messages
│   └── Input Form
```

## Props & State

The component doesn't accept any props but manages several state variables internally:

| State Variable | Type | Description |
|----------------|------|-------------|
| `messages` | `Message[]` | Array of chat messages with role, content, and timestamp |
| `input` | `string` | Current value of the input field |
| `isLoading` | `boolean` | Whether a request is in progress |
| `error` | `string \| null` | Error message if something goes wrong |

## Message Format

Each message follows this structure:

```typescript
type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};
```

## API Integration

The component communicates with the backend API through the `handleSubmit` function:

1. User input is captured and added to the messages state
2. A POST request is sent to `/api/chat` with the message content
3. The response is processed and added to the messages state
4. Loading states and errors are managed throughout the process

## Styling

The component uses Tailwind CSS with custom Stardew Valley-inspired styling:

- Custom color palette based on the game's aesthetic
- Pixel-style fonts for headings
- Rounded borders and shadows mimicking the game's UI
- Responsive design for all screen sizes
- Custom animations for message appearance

## Customization Options

### Changing the Avatar Images

To change the avatar images, update the image paths in the component:

```jsx
// For the assistant avatar (Stardew Sage)
<Image 
  src="/icons/stardew-sage.jpg" 
  alt="Stardew Sage" 
  width={40}
  height={40}
  className="object-cover"
/>

// For the user avatar
<Image 
  src="/icons/user-icon.jpg" 
  alt="You" 
  width={40}
  height={40}
  className="object-cover"
/>
```

### Modifying the Chat UI

The chat interface layout can be customized by adjusting the Tailwind classes in the component. Key areas for customization:

- Message bubbles: Modify the background colors, borders, and rounded corners
- Header: Change the gradient colors and layout
- Input form: Adjust the styling of the input field and button

## Using a Different AI Model

The ChatInterface component is designed to work with any AI model by modifying the API integration. To use a different model:

1. **Update the API Route**: Modify the `/api/chat/route.ts` file to use your preferred AI model's API
2. **Adjust the Request Format**: Change the request body structure to match your AI provider's requirements
3. **Process the Response**: Update the response handling to extract the AI's reply correctly

### Example: Using OpenAI Instead of Gemini

To switch from Gemini to OpenAI's API:

1. Install the OpenAI SDK:
   ```bash
   npm install openai
   ```

2. Update the API route in `src/app/api/chat/route.ts`:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import OpenAI from 'openai';

   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });

   export async function POST(request: NextRequest) {
     try {
       // Validate API key configuration
       if (!process.env.OPENAI_API_KEY) {
         console.error('Missing OpenAI API key in environment variables');
         return NextResponse.json(
           { error: 'OpenAI API key is not configured. Please check your environment variables.' },
           { status: 500 }
         );
       }

       // Parse and validate the request body
       const body = await request.json().catch(() => ({}));
       const { message } = body;

       if (!message || typeof message !== 'string') {
         return NextResponse.json(
           { error: 'Invalid message format. Please provide a text message.' },
           { status: 400 }
         );
       }

       // Call OpenAI API
       const completion = await openai.chat.completions.create({
         model: "gpt-3.5-turbo",
         messages: [
           {
             role: "system",
             content: `You are Stardew Sage, a friendly Stardew Valley expert who gives helpful, 
                      well-formatted advice about the game. Keep responses concise but informative.`
           },
           { role: "user", content: message }
         ],
         temperature: 0.7,
         max_tokens: 500,
       });

       // Extract the response
       const response = completion.choices[0].message.content;
       
       // Return the response to the client
       return NextResponse.json({ response });
     } catch (error) {
       console.error('Error in chat API route:', error);
       return NextResponse.json(
         { error: 'An unexpected error occurred. Please try again later.' },
         { status: 500 }
       );
     }
   }
   ```

3. Update your environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Performance Considerations

The ChatInterface component implements several optimizations:

- **Efficient Rendering**: Uses React's key prop for optimal list rendering
- **Lazy Loading**: Images use Next.js Image component for optimized loading
- **Debounced Input**: Could be added to prevent excessive re-renders during typing
- **Virtualized List**: For very long conversations, consider implementing virtualized lists

## Accessibility Features

The component includes several accessibility enhancements:

- **Semantic HTML**: Uses appropriate HTML elements for structure
- **Alt Text**: All images have descriptive alt text
- **Focus Management**: Form elements are properly focusable
- **Color Contrast**: Text colors provide sufficient contrast against backgrounds

## Troubleshooting

### Common Issues

1. **Messages not sending**:
   - Check network requests in browser dev tools
   - Verify API key is correctly set in .env.local
   - Check for errors in the console

2. **Styling issues on specific browsers**:
   - Add appropriate vendor prefixes
   - Test on multiple browsers and devices

3. **Slow response times**:
   - Consider implementing streaming responses
   - Optimize API calls and response handling

## Future Enhancements

Potential improvements for the ChatInterface component:

- **Message Persistence**: Save chat history to localStorage or a database
- **User Authentication**: Add user accounts to maintain conversation history
- **Voice Input/Output**: Add speech recognition and text-to-speech capabilities
- **Image Support**: Allow sending and receiving images related to Stardew Valley
- **Typing Indicators**: Show when the AI is "typing" a response
- **Message Reactions**: Add ability to react to messages with emojis 