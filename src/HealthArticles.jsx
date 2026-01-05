import { useState } from 'react';
import { Search, ArrowLeft, Clock, User, Tag, Heart, Share2, Bookmark, Calendar } from 'lucide-react';

export function HealthArticles({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarked, setBookmarked] = useState(new Set());

  const categories = [
    { id: 'all', label: 'All Articles', icon: '📚' },
    { id: 'tips', label: 'Health Tips', icon: '💡' },
    { id: 'awareness', label: 'Awareness', icon: '⚠️' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'mental', label: 'Mental Health', icon: '🧠' },
    { id: 'prevention', label: 'Prevention', icon: '🛡️' },
  ];

  const articles = [
    {
      id: 1,
      title: '10 Daily Health Tips for a Better Lifestyle',
      category: 'tips',
      author: 'Dr. Adekunle Obi',
      date: '2025-12-28',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
      excerpt: 'Discover simple yet effective daily habits that can improve your overall health and wellness.',
      content: `
Living a healthier lifestyle doesn't have to be complicated. Here are 10 simple daily tips that can make a significant difference:

1. **Drink Plenty of Water**
Start your day with a glass of water and aim for 8-10 glasses throughout the day. Proper hydration helps with digestion, energy levels, and skin health.

2. **Eat a Balanced Breakfast**
Never skip breakfast. A balanced meal with protein, whole grains, and fruits sets the tone for your entire day.

3. **Exercise Regularly**
Aim for at least 30 minutes of moderate exercise daily. This can include walking, swimming, cycling, or gym workouts.

4. **Get Adequate Sleep**
Sleep is crucial for your body's recovery and mental health. Aim for 7-9 hours each night.

5. **Manage Stress**
Practice meditation, deep breathing, or yoga to reduce stress levels.

6. **Limit Sugar and Salt**
Reduce your intake of processed foods high in sugar and salt. Focus on whole foods instead.

7. **Regular Health Checkups**
Schedule regular medical checkups to catch any potential health issues early.

8. **Eat More Vegetables**
Include at least 5 portions of fruits and vegetables in your daily diet.

9. **Reduce Screen Time**
Limit your exposure to screens, especially before bedtime. This helps with better sleep quality.

10. **Practice Gratitude**
Take time daily to appreciate the good things in your life. This has been shown to improve mental health.

Remember, small consistent changes lead to big results over time. Start implementing these tips today!
      `,
    },
    {
      id: 2,
      title: 'Understanding Diabetes: What You Need to Know',
      category: 'awareness',
      author: 'Dr. Amara Nwosu',
      date: '2025-12-27',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1576091160399-1c6ddb1c2b40?w=600&h=400&fit=crop',
      excerpt: 'A comprehensive guide to understanding diabetes, its types, and effective management strategies.',
      content: `
Diabetes is one of the most common chronic diseases affecting millions worldwide. This article provides essential information about diabetes.

**What is Diabetes?**
Diabetes is a condition where your body either cannot produce enough insulin or cannot use insulin effectively.

**Types of Diabetes:**

1. **Type 1 Diabetes**
- Occurs when the pancreas cannot produce insulin
- Usually diagnosed in children and young adults
- Requires daily insulin injections

2. **Type 2 Diabetes**
- The most common type
- Occurs when the body cannot use insulin effectively
- Can often be managed with lifestyle changes and medication

3. **Gestational Diabetes**
- Occurs during pregnancy
- Usually disappears after delivery but increases risk of Type 2

**Signs and Symptoms:**
- Increased thirst
- Frequent urination
- Fatigue
- Blurred vision
- Unexplained weight loss

**Management Strategies:**
- Regular monitoring of blood sugar levels
- Balanced diet with controlled carbohydrates
- Regular exercise
- Stress management
- Regular medical checkups

If you suspect you have diabetes, consult with a healthcare professional immediately.
      `,
    },
    {
      id: 3,
      title: 'The Power of Nutrition: Eating Right for Your Health',
      category: 'nutrition',
      author: 'Dr. Folake Adeyemi',
      date: '2025-12-26',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
      excerpt: 'Learn how proper nutrition can transform your health and prevent chronic diseases.',
      content: `
Nutrition is the foundation of good health. What you eat directly impacts your physical and mental well-being.

**Essential Nutrients Your Body Needs:**

1. **Proteins**
- Build and repair tissues
- Found in: chicken, fish, eggs, beans, nuts

2. **Carbohydrates**
- Provide energy
- Choose whole grains over refined carbs
- Found in: oats, brown rice, whole wheat bread

3. **Fats**
- Support hormone production and nutrient absorption
- Focus on healthy fats
- Found in: avocados, nuts, olive oil, fatty fish

4. **Vitamins and Minerals**
- Support immune function and overall health
- Found in: colorful vegetables and fruits

**Creating a Balanced Meal:**
- Half your plate should be vegetables
- Quarter should be lean protein
- Quarter should be whole grains
- Include healthy fats

**Tips for Better Eating Habits:**
- Plan your meals ahead
- Read nutrition labels
- Cook at home more often
- Limit processed foods
- Stay hydrated

Remember: Healthy eating is not about restriction, it's about nourishment.
      `,
    },
    {
      id: 4,
      title: 'Mental Health Matters: Breaking the Stigma',
      category: 'mental',
      author: 'Dr. Chioma Okoro',
      date: '2025-12-25',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
      excerpt: 'Understanding mental health and why it\'s just as important as physical health.',
      content: `
Mental health is an integral part of overall well-being. It affects how we think, feel, and act in our daily lives.

**What is Mental Health?**
Mental health includes our emotional, psychological, and social well-being. It's about how we handle stress, relationships, and daily challenges.

**Common Mental Health Conditions:**
- Anxiety disorders
- Depression
- Stress disorders
- Sleep disorders
- Eating disorders

**Signs You Might Need Help:**
- Persistent sadness
- Excessive worry
- Difficulty concentrating
- Changes in sleep or appetite
- Withdrawal from social activities

**Ways to Support Your Mental Health:**
1. **Professional Help**
   - Talk to a therapist or counselor
   - Don't hesitate to seek professional support

2. **Self-Care**
   - Exercise regularly
   - Practice mindfulness
   - Maintain healthy sleep

3. **Social Support**
   - Talk to friends and family
   - Join support groups
   - Connect with others

4. **Lifestyle Changes**
   - Reduce stress
   - Limit substance use
   - Maintain work-life balance

**Remember:** Mental health is health. Seeking help is a sign of strength, not weakness.
      `,
    },
    {
      id: 5,
      title: 'Fitness for Everyone: Starting Your Workout Journey',
      category: 'fitness',
      author: 'Coach Tunde Adeyinka',
      date: '2025-12-24',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
      excerpt: 'A beginner-friendly guide to starting and maintaining a consistent fitness routine.',
      content: `
Starting a fitness journey can be intimidating, but it doesn't have to be. Here's everything a beginner needs to know.

**Why Exercise is Important:**
- Improves cardiovascular health
- Strengthens muscles and bones
- Enhances mental health
- Helps maintain healthy weight
- Increases energy levels

**Types of Exercise:**

1. **Cardio Exercises**
   - Walking, running, cycling
   - Swimming, dancing
   - Benefits: Heart health, endurance

2. **Strength Training**
   - Weightlifting, resistance bands
   - Bodyweight exercises
   - Benefits: Muscle building, metabolism

3. **Flexibility and Balance**
   - Yoga, stretching
   - Pilates
   - Benefits: Mobility, injury prevention

**Getting Started:**
1. Start small - 20-30 minutes, 3 times per week
2. Choose activities you enjoy
3. Be consistent
4. Gradually increase intensity
5. Set realistic goals

**Tips for Success:**
- Find a workout buddy
- Track your progress
- Rest and recover properly
- Stay hydrated
- Eat well to fuel your workouts

**Common Mistakes to Avoid:**
- Starting too hard and burning out
- Not warming up
- Ignoring proper form
- Not recovering adequately

Remember: The best exercise is the one you'll actually do consistently!
      `,
    },
    {
      id: 6,
      title: 'Disease Prevention: Building Your Immunity',
      category: 'prevention',
      author: 'Dr. Adetokunbo Adebayo',
      date: '2025-12-23',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1633613286991-611bcdf45c73?w=600&h=400&fit=crop',
      excerpt: 'Simple strategies to strengthen your immune system and prevent common illnesses.',
      content: `
Prevention is better than cure. A strong immune system is your body's best defense against illness.

**How Your Immune System Works:**
Your immune system is a complex network of cells and proteins that protect against harmful invaders.

**Ways to Boost Your Immunity:**

1. **Eat Immune-Boosting Foods**
   - Citrus fruits (vitamin C)
   - Red bell peppers
   - Broccoli
   - Garlic
   - Ginger
   - Almonds

2. **Get Quality Sleep**
   - 7-9 hours per night
   - Keeps immune cells functioning properly
   - Helps fight infections

3. **Exercise Regularly**
   - Improves circulation
   - Enhances immune function
   - Reduces stress

4. **Manage Stress**
   - Chronic stress weakens immunity
   - Practice meditation or yoga
   - Ensure proper rest

5. **Maintain Hygiene**
   - Wash hands regularly
   - Cover mouth when coughing
   - Keep environment clean

6. **Stay Hydrated**
   - Water is essential for immune function
   - Aim for 8-10 glasses daily

7. **Get Vaccinated**
   - Follow recommended vaccine schedules
   - Protects against preventable diseases

**Foods for Immunity:**
- Citrus fruits
- Berries
- Nuts
- Fish
- Yogurt with probiotics

**When to See a Doctor:**
- Persistent fever
- Recurring infections
- Unusual fatigue
- Swollen lymph nodes

A healthy lifestyle is your best defense!
      `,
    },
  ];

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const searchedArticles = filteredArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBookmark = (articleId) => {
    const newBookmarked = new Set(bookmarked);
    if (newBookmarked.has(articleId)) {
      newBookmarked.delete(articleId);
    } else {
      newBookmarked.add(articleId);
    }
    setBookmarked(newBookmarked);
  };

  if (selectedArticle) {
    const article = articles.find((a) => a.id === selectedArticle);

    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => setSelectedArticle(null)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900 flex-1">Health Article</h1>
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked.has(article.id)
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Bookmark className="h-6 w-6" fill={bookmarked.has(article.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden mb-8 h-96">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600 uppercase">
                {categories.find((c) => c.id === article.category)?.label}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{article.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{article.readTime}</span>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex gap-2 pb-6 border-b border-slate-200">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-slate max-w-none mb-12">
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
              {article.content}
            </div>
          </div>

          {/* Related Articles */}
          <div className="border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.slice(0, 2).map((relArticle) => (
                <button
                  key={relArticle.id}
                  onClick={() => setSelectedArticle(relArticle.id)}
                  className="group text-left"
                >
                  <div className="rounded-lg overflow-hidden mb-3 h-40 bg-slate-100">
                    <img
                      src={relArticle.image}
                      alt={relArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {relArticle.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate('logged-in')}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="h-6 w-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Health & Wellness Articles</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {searchedArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No articles found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article.id)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group text-left"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(article.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur transition-colors ${
                      bookmarked.has(article.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Bookmark className="h-5 w-5" fill={bookmarked.has(article.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-600 uppercase">
                      {categories.find((c) => c.id === article.category)?.label}
                    </span>
                    <span className="text-xs text-slate-500">{article.readTime}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-2">{article.excerpt}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <span className="text-xs text-slate-500">{article.author}</span>
                    <span className="text-xs text-slate-400">{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
