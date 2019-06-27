/**
 * Highlight pipe which is used to highlight the searched text.
 */
import { Pipe, PipeTransform } from '@angular/core';
// Pipe which is used to highlight the searched text from the displayed records.
@Pipe({
    name: 'highlight'
})
/**
 * Class which is used to highlight the searched text.
 */
export class HighlightSearch implements PipeTransform {
    /**
     * Method which is used to convert the searched string into lowercase letters to made search easy.
     * @param value the searched string
     * @param args number of arguments
     */
    transform(value: any, args: any): any {
        const re = new RegExp(args, 'gi'); // 'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
        return value.replace(re, '<mark>' + args + '</mark>');
    }
}
