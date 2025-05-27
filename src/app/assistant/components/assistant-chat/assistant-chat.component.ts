import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AssistantService} from "../../services/assistant.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import IChatMessage from "../../../shared/models/IChatMessage";


@Component({
  selector: 'app-assistant-chat',
  templateUrl: './assistant-chat.component.html',
  styleUrls: ['./assistant-chat.component.scss']
})
export class AssistantChatComponent implements OnInit, OnDestroy {
  messages: IChatMessage[] = [];
  currentMessage: string = '';
  private messagesSubscription: Subscription | null = null;

  constructor(private assistantService: AssistantService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.messagesSubscription = this.assistantService.getAssistantMessages().subscribe(
      response => {
        this.addMessage(response);
      },
      error => {
        console.error('WebSocket error:', error);
        this.addMessage({ type: 'system', payload: 'Connection to assistant failed. Please try again later.' });
      },
      () => {
        console.log('WebSocket connection closed.');
        this.addMessage({ type: 'system', payload: 'Assistant session ended.' });
      }
    );
  }

  /**
   * Sends the current user message to the assistant service.
   */
  send(): void {
    if (this.currentMessage.trim()) {
      // Add the user's message to the display list immediately
      this.addMessage({ type: 'user', payload: this.currentMessage });

      // Send the message via the assistant service (WebSocket)
      this.assistantService.sendMessage(this.currentMessage);

      // Clear the input field
      this.currentMessage = '';
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from WebSocket messages to prevent memory leaks
    this.messagesSubscription?.unsubscribe();
    // Close the WebSocket connection when the component is destroyed
    this.assistantService.closeConnection();
  }

  /**
   * Helper method to add a message to the chat display list.
   * It also processes the message payload to make links clickable and safe.
   */
  private addMessage(message: IChatMessage): void {
    const chatMessage: IChatMessage = {...message };
    // Process the raw payload to generate safe HTML for display
    chatMessage.displayHtml = this.processMessageContent(chatMessage.payload);
    this.messages.push(chatMessage);
  }

  /**
   * Identifies URLs in a string, wraps them in <a> tags, and sanitizes the result.
   * This is crucial for securely rendering dynamic HTML with clickable links.
   * @param content The raw message string.
   * @returns A SafeHtml object suitable for [innerHTML] binding.
   */
  private processMessageContent(content: string): SafeHtml {
    // Regular expression to find HTTP/HTTPS URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // Replace found URLs with HTML anchor tags
    const htmlContent = content.replace(urlRegex, (url) => {
      // Basic validation: ensure the URL starts with http:// or https:// for safety
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">Link</a>`;
      }
      return url; // If it doesn't match the criteria, return the original text
    });

    // Mark the generated HTML as safe for Angular to render.
    // WARNING: Only use bypassSecurityTrustHtml() if you are absolutely sure the HTML content
    // is safe and originates from a trusted source (like content you generated yourself here).
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }
}
