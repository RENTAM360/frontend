// import { getOwnerReviews } from "@/lib/data"
import { FeedbackPageClient } from "@/components/reviews-page-client"

export default async function OwnerReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // const { owner } = await getOwnerReviews(id)

  return <FeedbackPageClient ownerId={id} />
}
