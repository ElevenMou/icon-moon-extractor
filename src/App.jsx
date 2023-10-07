import "./style/App.scss";
import JSONConverter from "./components/JSONConverter";
import Layout from "./components/Layouts/Layout";

function App() {
    return (
        <Layout>
            <JSONConverter />
        </Layout>
    );
}

export default App;
