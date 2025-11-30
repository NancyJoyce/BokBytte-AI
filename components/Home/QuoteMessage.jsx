import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const quotes = [
  {
    text: "A reader lives a thousand lives before he dies.",
    author: "George R.R. Martin",
  },
  {
    text: "So many books, so little time.",
    author: "Frank Zappa",
  },
  {
    text: "Until I feared I would lose it, I never loved to read.",
    author: "Harper Lee",
  },
  {
    text: "Books are a uniquely portable magic.",
    author: "Stephen King",
  },
  {
    text: "Reading is essential for those who seek to rise above the ordinary.",
    author: "Jim Rohn",
  },
  {
    text: "The only thing you absolutely have to know is the location of the library.",
    author: "Albert Einstein",
  },
];

export default function QuoteMessage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 15000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const quote = quotes[index];

  return (
    <View style={styles.container}>
      <Text style={styles.quoteText}>"{quote.text}"</Text>
      <Text style={styles.authorText}>— {quote.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.THISTLE, // soft pinkish-beige
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  quoteText: {
    fontFamily: 'solway-medium',
    fontSize: 16,
    color: Colors.GRAY,
    lineHeight: 22,
  },
  authorText: {
    fontFamily: 'solway-medium',
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'right',
    marginTop: 8,
  },
});
