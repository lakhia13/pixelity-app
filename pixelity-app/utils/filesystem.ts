import * as FileSystem from "expo-file-system";
import axios from 'axios';

export const saveImage = async (url: string) => {
	try {
		const downloadUri = `${FileSystem.cacheDirectory}downloaded_image.jpg`;

		const { uri } = await FileSystem.downloadAsync(url, downloadUri);

		const fileName = `photo_${Date.now()}.jpg`;
		const fileUri = `${FileSystem.documentDirectory}${fileName}`;

		await FileSystem.copyAsync({ from: uri, to: fileUri });
		console.log("Saved image at:", fileUri);

		return fileUri;
	}
	catch (error) {
		console.error('Error saving image:', error);
	}
}

export const readStorage = async () => {
	const results = await FileSystem.readDirectoryAsync("file:///data/user/0/host.exp.exponent/files");
	console.log(results);

	return results;
}

export const uploadToServer = async (base64: string, filename: string) => {
	try {
		const formData = new FormData();
		formData.append("filename", filename);
		formData.append("image", `data:image/jpeg;base64,${base64}`);
		
		const response = await fetch('http://192.168.73.150:3000/api/upload', {
			mode: 'no-cors',
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			body: formData
		});

		const data = await response.json();
		// // const params = new URLSearchParams(`filename=${filename}&image=data:image/jpeg;base64,${base64}`);
		// axios.post('http://localhost:3000/api/upload', {
		// 	filename: filename,
		// 	image: `data:image/jpeg;base64,${base64}`,
		// });
		
		if (data.success) {
			console.log('Image uploaded:', data.url);
		}
		else {
			console.error('Upload failed:', data.error);
		}
	}
	catch (error) {
		console.error('Upload error:', error);
	}
}
