import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, Button, View } from 'react-native';
import { WebView } from 'react-native-webview';

const App: React.FC = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [currentUrl, setCurrentUrl] = useState('http://localhost:5173/');

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    Dimensions.addEventListener('change', onChange);
    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  // CSS to disable vertical scrolling and make it responsive
  const injectCSS = `
    html, body {
      overflow-y: hidden !important; /* Disable vertical scrolling */
      height: 100% !important; /* Ensure the body takes full height */
      margin: 0 !important; /* Remove default margin */
      width: 100% !important; /* Ensure the body takes full width */
    }
    @media (max-width: ${dimensions.width}px) {
      body {
        font-size: 16px; /* Example of responsive font size */
      }
    }
  `;

  const handleNavigationStateChange = (newNavState) => {
    // Update the current URL state
    setCurrentUrl(newNavState.url);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Navigation Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <Button title="Dashboard" onPress={() => setCurrentUrl('http://localhost:5173/dashboard')} />
        <Button title="Inventory" onPress={() => setCurrentUrl('http://localhost:5173/donor/inventory')} />
        <Button title="History" onPress={() => setCurrentUrl('http://localhost:5173/donor/history')} />
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: currentUrl }}
        style={[styles.webView, { height: dimensions.height }]}
        injectedJavaScript={`const style = document.createElement('style'); style.textContent = \`${injectCSS}\`; document.head.append(style);`}
        javaScriptEnabled={true} // Ensure JavaScript is enabled
        startInLoadingState={true} // Optional: for loading state handling
        scrollEnabled={false} // Disable native scrolling in WebView
        onNavigationStateChange={handleNavigationStateChange} // Track URL changes
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    width: '100%',
  },
});

export default App;