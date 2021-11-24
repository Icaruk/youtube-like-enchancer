
let span;



const addLikesData = (borraSpan = false) => {
	
	const intervalMs = 50;
	let passedMs = 0;
	
	const interval = setInterval( () => {
		
		let views = document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer");
		
		if (passedMs > 5000) {
			console.log( "Timeout" );
			clearInterval(interval);
			return;
		};
		
		
		passedMs += intervalMs;
		
		
		
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
			
			console.log( "likesNode", `(${typeof likesNode}): `, likesNode);
			
			// Añado evento onclick
			const ELClick = likesNode.parentElement.addEventListener("click", ev => {
				
				ev.target.removeEventListener("click", ELClick);
				addLikesData(true);
				
			});
			
			
			likes = likes.replace(/[^0-9]/g, "");
			
			
			// views --- 100%
			// likes --- X
			const relacion = (+likes * 100 / +views).toFixed(2);
			
			
			// Append span to likesNode
			setTimeout( () => {
				
				if (borraSpan) {
					span && span.remove();
					span = null;
				} else {
					span = document.getElementById("likes-data-ext");
				};
					
				
				if (!span) {
					span = document.createElement("span");
					span.id = "likes-data-ext";
					span.style.color = "gray";
					span.style.fontSize = "12px"
					span.style.marginLeft = "4px"
					likesNode.appendChild(span);
				};
				
				span.innerText = `(${relacion}%)`;
				
			}, 1);
			
		};
		
	}, intervalMs);
	
};



( () => {
	
	let lastUrl = window.location.href;
	
	new MutationObserver(() => {
		
		const url = location.href;
		
		if (url !== lastUrl) {
			
			lastUrl = url;
			setTimeout( () => addLikesData(true), 1000);
			
		};
	}).observe(document, { subtree: true, childList: true });
	
	
	
	document.addEventListener("readystatechange", () => {
		if (document.readyState !== "complete") return;
		addLikesData();
	});
	
	
	
})(window.document);
