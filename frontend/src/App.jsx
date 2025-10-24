import './App.css'
import {ErrorProvider} from "./context/ErrorProvider.jsx";
import DummyErrorButton from "./components/ui/DummyErrorButton.jsx";


function App() {
  return (
    <ErrorProvider>
      <div style={{ position: "fixed", top: 16, left: 16}}>
        <DummyErrorButton />
      </div>
    </ErrorProvider>
  );
}

export default App
