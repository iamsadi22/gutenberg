/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	Warning,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import {
	__experimentalUseDisabled as useDisabled,
	useInstanceId,
} from '@wordpress/compose';

export default function PostCommentsEdit( {
	attributes: { textAlign },
	setAttributes,
	context: { postType, postId },
} ) {
	let [ postTitle ] = useEntityProp( 'postType', postType, 'title', postId );
	postTitle = postTitle || __( 'Post Title' );

	const [ commentStatus ] = useEntityProp(
		'postType',
		postType,
		'comment_status',
		postId
	);

	const { avatarURL, defaultCommentStatus } = useSelect(
		( select ) =>
			select( blockEditorStore ).getSettings()
				.__experimentalDiscussionSettings
	);

	const isSiteEditor = postType === undefined || postId === undefined;

	const postTypeSupportsComments = useSelect( ( select ) =>
		postType
			? !! select( coreStore ).getPostType( postType )?.supports.comments
			: false
	);

	let warning = __(
		'Post Comments block: This is just a placeholder, not a real comment. The final styling may differ because it also depends on the current theme. For better compatibility with the Block Editor, please consider replacing this block with the "Comments Query Loop" block.'
	);
	let showPlacholder = true;

	if ( ! isSiteEditor && 'open' !== commentStatus ) {
		if ( 'closed' === commentStatus ) {
			warning = sprintf(
				/* translators: 1: Post type (i.e. "post", "page") */
				__(
					'Post Comments block: Comments to this %s are not allowed.'
				),
				postType
			);
			showPlacholder = false;
		} else if ( ! postTypeSupportsComments ) {
			warning = sprintf(
				/* translators: 1: Post type (i.e. "post", "page") */
				__(
					'Post Comments block: Comments for this post type (%s) are not enabled.'
				),
				postType
			);
			showPlacholder = false;
		} else if ( 'open' !== defaultCommentStatus ) {
			warning = __( 'Post Comments block: Comments are not enabled.' );
			showPlacholder = false;
		}
	}

	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	const disabledRef = useDisabled();

	const textareaId = useInstanceId( PostCommentsEdit );

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>

			<div { ...blockProps }>
				<Warning>{ warning }</Warning>

				{ showPlacholder && (
					<div
						className="wp-block-post-comments__placeholder"
						ref={ disabledRef }
					>
						<h3>
							{ __( 'One response to' ) } “{ postTitle }”
						</h3>

						<div className="navigation">
							<div className="alignleft">
								<a href="#top">« { __( 'Older Comments' ) }</a>
							</div>
							<div className="alignright">
								<a href="#top">{ __( 'Newer Comments' ) } »</a>
							</div>
						</div>

						<ol className="commentlist">
							<li className="comment even thread-even depth-1">
								<article className="comment-body">
									<footer className="comment-meta">
										<div className="comment-author vcard">
											<img
												alt="Commenter Avatar"
												src={ avatarURL }
												className="avatar avatar-32 photo"
												height="32"
												width="32"
												loading="lazy"
											/>
											<b className="fn">
												<a href="#top" className="url">
													{ __(
														'A WordPress Commenter'
													) }
												</a>
											</b>{ ' ' }
											<span className="says">
												{ __( 'says' ) }:
											</span>
										</div>

										<div className="comment-metadata">
											<a href="#top">
												<time dateTime="2000-01-01T00:00:00+00:00">
													{ __(
														'January 1, 2000 at 00:00 am'
													) }
												</time>
											</a>{ ' ' }
											<span className="edit-link">
												<a
													className="comment-edit-link"
													href="#top"
												>
													{ __( 'Edit' ) }
												</a>
											</span>
										</div>
									</footer>

									<div className="comment-content">
										<p>
											{ __( 'Hi, this is a comment.' ) }
											<br />
											{ __(
												'To get started with moderating, editing, and deleting comments, please visit the Comments screen in the dashboard.'
											) }
											<br />
											{ __(
												'Commenter avatars come from'
											) }{ ' ' }
											<a href="https://gravatar.com/">
												Gravatar
											</a>
											.
										</p>
									</div>

									<div className="reply">
										<a
											className="comment-reply-link"
											href="#top"
											aria-label="Reply to A WordPress Commenter"
										>
											{ __( 'Reply' ) }
										</a>
									</div>
								</article>
							</li>
						</ol>

						<div className="navigation">
							<div className="alignleft">
								<a href="#top">« { __( 'Older Comments' ) }</a>
							</div>
							<div className="alignright">
								<a href="#top">{ __( 'Newer Comments' ) } »</a>
							</div>
						</div>

						<div className="comment-respond">
							<h3 className="comment-reply-title">
								{ __( 'Leave a Reply' ) }
							</h3>

							<form className="comment-form" noValidate>
								<p className="comment-form-comment">
									<label
										htmlFor={ `comment-${ textareaId }` }
									>
										{ __( 'Comment' ) }{ ' ' }
										<span className="required">*</span>
									</label>
									<textarea
										id={ `comment-${ textareaId }` }
										name="comment"
										cols="45"
										rows="8"
										required
									/>
								</p>
								<p className="form-submit wp-block-button">
									<input
										name="submit"
										type="submit"
										className="submit wp-block-button__link"
										value={ __( 'Post Comment' ) }
									/>
								</p>
							</form>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
