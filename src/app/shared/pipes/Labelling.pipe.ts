import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labelling', // The name used in the template
  pure: true
})
export class LabellingPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Ensure value is a string
    let result = String(value);

    // 1. Insert a space before any uppercase letter that is preceded by a lowercase letter
    // Example: "firstName" becomes "first Name"
    result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

    // 2. Insert a space before any digit that is preceded by a letter
    // Example: "address1" becomes "address 1"
    result = result.replace(/([A-Za-z])(\d)/g, '$1 $2');


    // 3. Capitalize the first letter of each word
    // Split the string by spaces (handle multiple spaces)
    const words = result.split(/\s+/);

    // Map over each word to capitalize its first letter and make the rest lowercase
    const capitalizedWords = words.map(word => {
      if (!word) return ''; // Handle potential empty strings resulting from split
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // 4. Join the words back together with a single space
    return capitalizedWords.join(' ');
  }
}
