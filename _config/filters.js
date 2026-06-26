import { DateTime } from "luxon";

export default function(eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter("rejectUrl", (array, url) => {
		return (array || []).filter(item => item.url !== url);
	});

	eleventyConfig.addFilter("findPerson", (people, slug) => {
		return (people || []).find(p => p.slug === slug) || null;
	});

	eleventyConfig.addFilter("filterByAuthor", (posts, slug) => {
		return (posts || []).filter(post => post.data && post.data.author === slug);
	});

	eleventyConfig.addFilter("relatedPosts", (allPosts, currentUrl, keywords, topics) => {
		const currentTerms = new Set([
			...(Array.isArray(keywords) ? keywords : []),
			...(Array.isArray(topics) ? topics : []),
		].map(t => String(t).toLowerCase()));

		return (allPosts || [])
			.filter(post => post.url !== currentUrl)
			.map(post => {
				const postTerms = [
					...(Array.isArray(post.data.keywords) ? post.data.keywords : []),
					...(Array.isArray(post.data.topics) ? post.data.topics : []),
				].map(t => String(t).toLowerCase());
				const score = postTerms.filter(t => currentTerms.has(t)).length;
				return { post, score };
			})
			.sort((a, b) => {
				if (b.score !== a.score) return b.score - a.score;
				const dateA = a.post.data.date ? new Date(a.post.data.date) : a.post.date;
				const dateB = b.post.data.date ? new Date(b.post.data.date) : b.post.date;
				return dateB - dateA;
			})
			.slice(0, 3)
			.map(({ post }) => post);
	});

};
