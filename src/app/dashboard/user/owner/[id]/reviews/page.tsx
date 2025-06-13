import { getOwnerReviews } from "@/lib/data"
import { ReviewsPageClient } from "@/components/reviews-page-client"

export default async function OwnerReviewsPage({ params }: { params: { id: string } }) {
  const { owner, reviews } = await getOwnerReviews(params.id)

  return <ReviewsPageClient owner={owner} reviews={reviews} ownerId={params.id} />
}
