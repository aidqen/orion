# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Anthropic API Key (for Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Your Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys
4. Create a new API key
5. Copy it and paste as `ANTHROPIC_API_KEY` in `.env.local`

## Testing the Setup

After setting up the environment variable:

1. Restart your development server: `pnpm dev`
2. Check the terminal for any errors
3. When you send a message, check the browser console for:
   - `🚀 ~ ChatPage ~ status:` - should show "streaming" then "done"
   - `🚀 ~ ChatPage ~ error:` - should be `undefined` if working
   - `🚀 ~ POST ~ messages:` - in server logs
   - `🚀 ~ POST ~ result created, streaming response` - in server logs

## Troubleshooting

If you get no response:

1. **Check environment variable**: Make sure `ANTHROPIC_API_KEY` is set in `.env.local`
2. **Restart dev server**: Environment variables require a restart
3. **Check browser console**: Look for any errors from `useChat`
4. **Check server logs**: Look for errors in the terminal running `pnpm dev`
5. **Verify API key**: Make sure your Anthropic API key is valid and has credits

## Model Configuration

Current model: `anthropic/claude-3-5-haiku-20241022` (Claude Haiku 4.5)

You can change this in `app/api/chat/route.ts` line 20.

