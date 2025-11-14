# AI Content Generation Setup

## ✨ Feature Overview

The resource management system now includes AI-powered content generation with web research capabilities! When creating new resources, you can:

1. **Select Resource Type**: Article, Ad/Landing Page, Blog, Prompts, Tool, Guide, or Video
2. **Choose Research Options**: Include web research or deep research
3. **Enter Topic**: Describe what you want the AI to write about
4. **Generate**: AI conducts research (if enabled) and generates complete content

## 🚀 How It Works

### New Resource Creation Flow:

1. **Go to** `/admin/resource-management/new`
2. **Select Resource Type**: Choose from 7 types (Article, Ad/Landing Page, Blog, etc.)
3. **Choose Research** (optional):
   - ☑️ Include Web Research - AI searches the web for current information
   - ☑️ Deep Research - More thorough research with multiple sources
4. **Enter Topic**: Describe what you want AI to write about
5. **Click "Generate Content with AI"**: 
   - If research enabled: AI searches web → generates content with research
   - If no research: AI generates content from knowledge
6. **Review & Edit**: Generated content appears in editor with live preview
7. **Save**: Create your resource

## 🔧 Setup Instructions

### Step 1: Get OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to **Keys** section
4. Click **Create Key**
5. Copy the API key (starts with `sk-or-`)

### Step 2: Add to Environment Variables

Add the API key to your `.env.local` file:

```bash
OPENROUTER_API_KEY=sk-or-your-api-key-here
```

### Step 3: Restart Development Server

After adding the environment variable, restart your Next.js dev server:

```bash
npm run dev
```

## 📝 Usage Examples

### Example 1: Article with Web Research

1. Select **Article** type
2. Check **Include Web Research**
3. Enter topic: "Latest trends in AI app development in 2024"
4. Click Generate
5. AI searches web → Generates article with current information

### Example 2: Landing Page without Research

1. Select **Ad / Landing Page** type
2. Leave research unchecked
3. Enter topic: "AI-powered business card generator"
4. Click Generate
5. AI generates landing page copy with hero, features, CTA

### Example 3: Blog Post with Deep Research

1. Select **Blog Post** type
2. Check **Include Web Research** + **Deep Research**
3. Enter topic: "How to build a SaaS product without coding"
4. Click Generate
5. AI conducts thorough research → Generates comprehensive blog post

## 🎨 What AI Generates

The AI creates complete resources with:
- ✅ **Title & Description**: Auto-generated based on topic
- ✅ **Icon**: Relevant emoji
- ✅ **5-10 Sections**: Comprehensive content coverage
- ✅ **Clear Headings**: Engaging section titles
- ✅ **Detailed Text**: Well-written paragraphs
- ✅ **Bullet Points**: Lists of features, steps, tips
- ✅ **Code Examples**: Where relevant (for technical content)
- ✅ **Helpful Notes**: Tips and important information
- ✅ **Web Citations**: URLs included when research is used

## ⚙️ Configuration

The AI uses:
- **Model**: `openai/gpt-5.1` (via OpenRouter)
- **Web Search**: Native OpenAI search (when enabled)
- **Deep Research**: High search context size (10 results)
- **Regular Research**: Standard search context (5 results)
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Format**: JSON (structured output)

## 💰 Cost Considerations

### OpenRouter Pricing:
- **GPT-5.1**: Check [OpenRouter pricing](https://openrouter.ai/models) for current rates
- **Web Search**: 
  - Native search: Provider passthrough pricing
  - Deep research: Higher context = more cost
- **Estimated**: ~$0.01-0.05 per generation (varies by length)

### Research Options:
- **No Research**: Fastest, lowest cost
- **Web Research**: Adds ~$0.02-0.03 per request
- **Deep Research**: Adds ~$0.05-0.10 per request (more sources)

## 🔒 Security

- API key is stored server-side only (never exposed to client)
- API route verifies admin status before allowing generation
- Generated content is validated before being returned
- Web search results are filtered and validated

## 🐛 Troubleshooting

### "OpenRouter API key not configured"
- Make sure `OPENROUTER_API_KEY` is in `.env.local`
- Restart your dev server after adding the key
- Key should start with `sk-or-`

### "Failed to generate content"
- Check your OpenRouter API key is valid
- Verify you have credits in your OpenRouter account
- Check browser console for detailed error messages
- Ensure GPT-5.1 model is available on OpenRouter

### Web research not working
- Verify model supports web search (GPT-5.1 does)
- Check if you have sufficient credits
- Try without research first to test basic generation

### Content not formatted correctly
- The AI should format content properly, but you can always edit manually
- Try regenerating if the format isn't right
- Check that JSON structure is valid

## 📚 Resource Types

- **Article**: Comprehensive, well-researched articles
- **Ad / Landing Page**: Conversion-focused copy with CTAs
- **Blog Post**: Engaging, conversational blog content
- **Prompts**: Collections of useful prompts
- **Tool**: Tool usage guides and tutorials
- **Guide**: Step-by-step instructional guides
- **Video**: Video script/outline content

## 🌐 Web Research Features

### Regular Web Research:
- Searches current web for topic
- Incorporates 5 relevant sources
- Cites sources in content

### Deep Research:
- More thorough search (10 sources)
- High search context size
- Multiple authoritative sources
- Comprehensive coverage

---

**Ready to use!** Just add your OpenRouter API key and start creating AI-powered resources with web research. 🚀

