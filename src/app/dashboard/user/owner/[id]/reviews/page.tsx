import { getOwnerReviews } from "@/lib/data"
import { ReviewsPageClient } from "@/components/reviews-page-client"

export default async function OwnerReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { owner, reviews } = await getOwnerReviews(id)

  return <ReviewsPageClient owner={owner} reviews={reviews} ownerId={id} />
}
