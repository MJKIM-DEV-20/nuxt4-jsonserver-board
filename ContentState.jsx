export  function ContentState({
  icon = 'pi-info-circle',
  title,
  description,
  compact = false,
  tone = 'neutral',
}) {
  const className = [
    'content-state',
    compact ? 'content-state--compact' : '',
    tone === 'danger' ? 'content-state--danger' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={className} role={tone === 'danger' ? 'alert' : 'status'}>
      <span className="content-state-icon" aria-hidden="true">
        <i className={`pi ${icon}`} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default function PostListSkeleton() {
  return (
    <div className="post-list-skeleton" aria-busy="true" aria-label="게시글을 불러오고 있어요">
      <div className="skeleton-row">
        <div className="skeleton-copy">
          <span className="skeleton-line skeleton-line--title" />
          <span className="skeleton-line skeleton-line--meta" />
        </div>
        <span className="skeleton-block" />
      </div>
      <div className="skeleton-row">
        <div className="skeleton-copy">
          <span className="skeleton-line skeleton-line--title" />
          <span className="skeleton-line skeleton-line--meta" />
        </div>
        <span className="skeleton-block" />
      </div>
      <div className="skeleton-row">
        <div className="skeleton-copy">
          <span className="skeleton-line skeleton-line--title" />
          <span className="skeleton-line skeleton-line--meta" />
        </div>
        <span className="skeleton-block" />
      </div>
      <div className="skeleton-row">
        <div className="skeleton-copy">
          <span className="skeleton-line skeleton-line--title" />
          <span className="skeleton-line skeleton-line--meta" />
        </div>
        <span className="skeleton-block" />
      </div>
      <div className="skeleton-row">
        <div className="skeleton-copy">
          <span className="skeleton-line skeleton-line--title" />
          <span className="skeleton-line skeleton-line--meta" />
        </div>
        <span className="skeleton-block" />
      </div>
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div className="article-skeleton" aria-busy="true" aria-label="게시글을 불러오고 있어요">
      <span className="skeleton-line skeleton-line--heading" />
      <span className="skeleton-line skeleton-line--heading-short" />
      <span className="skeleton-line skeleton-line--meta" />
      <div className="skeleton-body">
        <span className="skeleton-line" />
        <span className="skeleton-line" />
        <span className="skeleton-line skeleton-line--body-short" />
      </div>
    </div>
  )
}
