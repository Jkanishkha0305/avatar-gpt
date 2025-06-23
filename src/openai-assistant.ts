import OpenAI from "openai";

export class OpenAIAssistant {
  private client: OpenAI;
  private assistant: any;
  private thread: any;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }

//   async initialize(
//     instructions: string = `You are an English tutor. Help students improve their language skills by:
//     - Correcting mistakes in grammar and vocabulary
//     - Explaining concepts with examples
//     - Engaging in conversation practice
//     - Providing learning suggestions
//     Be friendly, adapt to student's level, and always give concise answers.`
//   ) {
//     // Create an assistant
//     this.assistant = await this.client.beta.assistants.create({
//       name: "English Tutor Assistant",
//       instructions,
//       tools: [],
//       model: "gpt-4-turbo-preview",
//     });

//     // Create a thread
//     this.thread = await this.client.beta.threads.create();
//   }

  async initialize(
    instructions: string = `You are an empathetic and experienced medical doctor named Joi. 
    Your job is to talk to users, ask relevant questions about their symptoms, and give potential diagnoses and remedies. 
    Be concise, use natural language like you're talking to a real patient, and never mention being an AI or language model. 
    If symptoms are unclear, ask clarifying questions. 
    Do not provide numbers, bullet points, or markdown formatting. Always answer in plain English, using two short sentences max.`
    ) {
    // Create assistant with low-cost model
    this.assistant = await this.client.beta.assistants.create({
        name: "Medical Doctor Assistant",
        instructions,
        tools: [],
        model: "gpt-3.5-turbo", // Cheapest available model
    });

    // Create a thread
    this.thread = await this.client.beta.threads.create();
    }

  async getResponse(userMessage: string): Promise<string> {
    if (!this.assistant || !this.thread) {
      throw new Error("Assistant not initialized. Call initialize() first.");
    }

    // Add user message to thread
    await this.client.beta.threads.messages.create(this.thread.id, {
      role: "user",
      content: userMessage,
    });

    // Create and run the assistant
    const run = await this.client.beta.threads.runs.createAndPoll(
      this.thread.id,
      { assistant_id: this.assistant.id }
    );

    if (run.status === "completed") {
      // Get the assistant's response
      const messages = await this.client.beta.threads.messages.list(
        this.thread.id
      );

      // Get the latest assistant message
      const lastMessage = messages.data.filter(
        (msg) => msg.role === "assistant"
      )[0];

      if (lastMessage && lastMessage.content[0].type === "text") {
        return lastMessage.content[0].text.value;
      }
    }

    return "Sorry, I couldn't process your request.";
  }
}
