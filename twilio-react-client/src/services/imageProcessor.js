export const checkImage = (path) => {
	const img = new Image();
	img.onload = () => console.log(img);
	img.onerror = (err) => console.log(err);
	img.src = path;
};
