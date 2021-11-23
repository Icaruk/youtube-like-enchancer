
let span;



const addLikesData = () => {
	
	let intervalMs = 250;
	let totalMs = 0;
	
	const interval = setInterval( () => {
		
		let views = document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer");
		
		if (totalMs > 5000) {
			console.log( "Timeout" );
			clearInterval(interval);
			return;
		};
		
		
		totalMs += intervalMs;
		
		
		
		if (views) {
			
			clearInterval(interval);
			
			views = views.innerText;
			views = views.replace(/[^0-9]/g, "");
			
			function getElementByXpath(path) {
				return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			};
			
			let likesNode = getElementByXpath("/html//div[@id='top-level-buttons-computed']/ytd-toggle-button-renderer[1]//yt-formatted-string[@id='text']");
			
			let likes = likesNode.getAttribute("aria-label");
			if (!likes) return console.log( "Likes not found" );
			
			likes = likes.replace(/[^0-9]/g, "");
			
			
			// views --- 100%
			// likes --- X
			const relacion = (+likes * 100 / +views).toFixed(2);
			
			
			// Append span to likesNode
			setTimeout( () => {
				
				span = document.getElementById("likes-data-ext");
				
				if (!span) {
					span = document.createElement("span");
					span.id = "likes-data-ext";
					span.style.color = "gray";
					span.style.fontSize = "12px"
					span.style.marginLeft = "4px"
					likesNode.appendChild(span);
				};
				
				span.innerText = `(${relacion}%)`;
				
			}, 1000);
			
		};
		
	}, intervalMs);
	
};


( () => {
	
	let lastUrl = window.location.href;
	
	new MutationObserver(() => {
		
		const url = location.href;
		
		if (url !== lastUrl) {
			
			lastUrl = url;
			
			span && span.remove();
			span = null;
			
			setTimeout(addLikesData, 1000);
			
		};
	}).observe(document, { subtree: true, childList: true });
	
	
	
	document.addEventListener("readystatechange", () => {
		if (document.readyState !== "complete") return;
		addLikesData();
	});
	
	
	
})(window.document);
