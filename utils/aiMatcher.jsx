// utils/aiMatch.js

export const findSmartMatches = (userBooks, otherBooks) => {
    const matches = [];
  
    const normalize = (str) => str?.toLowerCase().trim();
  
    userBooks.forEach(userBook => {
      const scoredSuggestions = otherBooks.map(book => {
        let score = 0;
  
        // Genre similarity
        if (normalize(book.genre) === normalize(userBook.genre)) {
          score += 5;
        } else if (normalize(book.genre)?.includes(normalize(userBook.genre))) {
          score += 3;
        }
  
        // Favorite books have high weight
        if (book.isFavorite || userBook.isFavorite) {
          score += 4;
        }
  
        // Language match
        if (normalize(book.language) === normalize(userBook.language)) {
          score += 2;
        }
  
        // Author match
        if (normalize(book.author) === normalize(userBook.author)) {
          score += 1;
        }
  
        return { ...book, matchScore: score };
      });
  
      // Sort by score descending
      const topSuggestions = scoredSuggestions
        .filter(book => book.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5); // Return top 5 suggestions per book
  
      matches.push({
        userBook,
        suggestions: topSuggestions,
      });
    });
  
    return matches;
  };
  


// // utils/aiMatch.js

// export const findGenreMatches = (userBooks, otherBooks) => {
//     const matches = [];
  
//     userBooks.forEach(userBook => {
//       const genreMatches = otherBooks.filter(
//         book => book.genre === userBook.genre
//       );
  
//       matches.push({
//         userBook,
//         suggestions: genreMatches.slice(0, 3), // Top 3 matching books
//       });
//     });
  
//     return matches;
//   };
  


// // utils/aiMatcher.js
// export function calculateMatchScore(bookA, bookB) {
//     let score = 0;
  
//     if (bookA.category === bookB.category) score += 50;
//     if (bookA.language === bookB.language) score += 20;
  
//     const pageDiff = Math.abs((bookA.pages || 0) - (bookB.pages || 0));
//     score += Math.max(0, 30 - pageDiff / 5); // More similar pages = better score
  
//     return score;
//   }
  
//   export function findBestMatches(userBook, allBooks) {
//     return allBooks
//       .filter(b => b.id !== userBook.id)
//       .map(candidate => ({
//         ...candidate,
//         score: calculateMatchScore(userBook, candidate)
//       }))
//       .sort((a, b) => b.score - a.score);
//   }
  