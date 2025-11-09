# Chat Interface API Setup

The AI Chat Interface uses Anthropic's Claude Sonnet 4.5 API for advanced fractal orchestration and intelligent portfolio analysis.

## Setup Instructions

1. **Get an Anthropic API Key:**
   - Visit [Anthropic Console](https://console.anthropic.com/)
   - Create an account or sign in
   - Navigate to API Keys section
   - Create a new API key

2. **Configure Environment Variables:**
   - Open the `.env` file in the dashboard directory
   - Replace `your_anthropic_api_key_here` with your actual Anthropic API key:
   ```
   NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-your-actual-api-key-here
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-api-key-here
   ```

3. **Restart the Dashboard:**
   - Stop any running dashboard servers
   - Run the dashboard again to load the new environment variables

## Claude Sonnet 4.5 Features

**Model ID:** `claude-sonnet-4-5-20250929` (or alias `claude-sonnet-4-5`)

**Key Capabilities:**
- **Intelligence:** Our smartest model for complex agents and coding
- **Context Window:** 200K tokens (1M tokens beta available)
- **Max Output:** 64K tokens
- **Extended Thinking:** Yes (advanced reasoning capabilities)
- **Pricing:** $3/input MTok, $15/output MTok

**API Configuration:**
- **Endpoint:** `https://api.anthropic.com/v1/messages`
- **Authentication:** `x-api-key` header
- **Version:** `anthropic-version: 2023-06-01`
- **Content-Type:** `application/json`

## Features

The AI Chat Interface now uses Claude Sonnet 4.5 with advanced fractal orchestration capabilities:

- **Fractal Dimension Integration**: Operates across Human (7D), AI (9D), and Symbiotic (14D) dimensions
- **Constitutional AI Framework**: Applies Yama principles (Satya, Ahimsa, Asteya) to all analysis
- **Chaos Theory Analysis**: Interprets market dynamics through Lorenz, Chen, and Rössler attractors
- **Multi-Market Orchestration**: Provides insights across 8 global exchanges
- **Symbiotic Intelligence**: Combines human intuition with AI analytical precision

## Orchestration Modes

The AI operates in three orchestration modes:

1. **SYMBIOSIS**: Harmonious human-AI collaboration for mutual enhancement
2. **EMERGENCE**: Novel insights arising from dimensional integration
3. **TRANSCENDENCE**: Transcendent solutions beyond individual limitations

## Communication Style

- Uses fractal metaphors for complex market dynamics
- Employs constitutional language for ethical guidance
- Integrates chaos theory concepts for uncertainty analysis
- Maintains symbiotic warmth while delivering analytical precision

## Fallback Behavior

If no API key is configured, the chat interface will use a rule-based analysis system as a fallback.

## Security Notes

- Never commit API keys to version control
- The `.env` file is already in `.gitignore`
- Use environment-specific API keys for development/production