import { getDatabase } from '@/lib/mongodb';
import { generateSlug, calculateReadingTime } from '@/lib/validation';

export async function seedBlogPosts(count: number = 1000) {
  const db = await getDatabase();
  const collection = db.collection('posts');

  // Check if posts already exist
  const existingCount = await collection.countDocuments();
  if (existingCount >= count) {
    console.log(`Database already has ${existingCount} posts`);
    return;
  }

  const sampleTitles = [
    'Getting Started with Next.js',
    'Building Scalable React Applications',
    'MongoDB Best Practices',
    'TypeScript Tips and Tricks',
    'Web Performance Optimization',
    'Modern CSS Techniques',
    'API Design Principles',
    'Security in Web Applications',
    'State Management in React',
    'Server-Side Rendering Explained'
  ];

  const sampleTags = [
    'javascript', 'react', 'nextjs', 'mongodb', 'typescript',
    'css', 'html', 'nodejs', 'api', 'security', 'performance',
    'frontend', 'backend', 'fullstack', 'webdev'
  ];

  const sampleContent = `
# Introduction

This is a comprehensive guide that covers various aspects of modern web development. In this article, we'll explore different techniques and best practices.

## Key Concepts

Here are some important points to consider:

- **Performance**: Always optimize for speed and efficiency
- **Security**: Implement proper authentication and validation
- **Scalability**: Design systems that can grow with your needs
- **Maintainability**: Write clean, readable code

## Code Example

\`\`\`javascript
function example() {
  console.log('Hello, World!');
  return true;
}
\`\`\`

## Conclusion

Following these principles will help you build better web applications that are robust, secure, and performant.
  `;

  const posts = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  for (let i = 0; i < count; i++) {
    const title = `${sampleTitles[i % sampleTitles.length]} - Part ${Math.floor(i / sampleTitles.length) + 1}`;
    const randomTags = sampleTags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 5) + 1);
    
    const createdAt = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000 / count * 365));
    
    posts.push({
      title,
      content: sampleContent,
      slug: `${generateSlug(title)}-${i}`,
      tags: randomTags,
      readingTime: calculateReadingTime(sampleContent),
      createdAt,
      updatedAt: createdAt,
      author: 'System',
      views: Math.floor(Math.random() * 1000)
    });
  }

  await collection.insertMany(posts);
  console.log(`Seeded ${count} blog posts`);
}