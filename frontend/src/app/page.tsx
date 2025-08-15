import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Hero from '@/components/home/Hero'
import FeaturedArticles from '@/components/home/FeaturedArticles'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import PodcastSection from '@/components/home/PodcastSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* 메인 콘텐츠 */}
      <main>
        <Hero />
        <FeaturedArticles />
        <CategoryShowcase />
        <PodcastSection />
        <NewsletterSignup />
      </main>
      
      <Footer />
    </div>
  )
}