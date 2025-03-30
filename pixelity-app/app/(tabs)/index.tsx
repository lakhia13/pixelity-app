import { Image, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { readStorage, saveImage, uploadToServer } from "@/utils/filesystem";
import { useEffect, useState } from "react";
import * as FileSystem from 'expo-file-system';

export default function HomeScreen() {
	const [savedPhotos, setSavedPhotos] = useState<string[]>([])
	
	// saveImage("https://drive.google.com/file/d/1CjDggXt-NNtDrEz6b24vmIeMg3oHqAoG/view?usp=sharing");

	useEffect(() => {
		(async () => {
			const results = await readStorage();
			setSavedPhotos(results);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (savedPhotos.length === 0) {
				return;
			}

			// for (const photo of savedPhotos.filter(photo => photo.includes(".jpg"))) {
				const base64 = await FileSystem.readAsStringAsync(`file:///data/user/0/host.exp.exponent/files/${savedPhotos[10]}`, {
					encoding: FileSystem.EncodingType.Base64,
				});
				// console.log(base64)
			
				// Define filename (unique timestamp)
				const filename = `photo_${Date.now()}.jpg`;

				uploadToServer(base64, filename);
			// }
		})();
	}, [savedPhotos]);

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#EEDCB0", dark: "#EEDCB0" }} // Tan background
			headerImage={
				<View style={styles.headerImageContainer}>
					<Image
						source={require('@/assets/images/logo.png')}
						style={styles.logo} // Centered image
						resizeMethod="resize"
					/>
				</View>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Welcome!</ThemedText>
				<HelloWave/>
			</ThemedView>

			<ThemedView style={styles.titleContainer}>
				<ThemedText type="subtitle">Your server is running hello</ThemedText>
			</ThemedView>

			<ThemedView style={styles.fileList}> {
				savedPhotos.map((photo, i) => {
					return (
						photo.includes(".jpg") && <ThemedText key={i} type="default">{photo}</ThemedText>
					)
				})
			} </ThemedView>
			
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: 8,
	},

	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},

	headerImageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%', // Ensures it takes the full width
		paddingVertical: 20, // Optional padding
	},

	logo: {
		top: 20,
		width: 200,
		height: 200,
	},
	
	fileList: {
		flexDirection: "column",
		alignItems: "flex-start",
		gap: 2
	}
});
