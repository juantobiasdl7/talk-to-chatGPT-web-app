import './App.css';
import AudioRecorder from './Components/AudioRecorder'; 
import Visualizer from './Components/Visualizer';

function App() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Visualizer />    
      <AudioRecorder />
    </div>
  );
}

export default App;
