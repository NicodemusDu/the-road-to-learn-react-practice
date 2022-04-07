import logo from "./logo.svg";
import "./App.css";

const welcome = {
    greeting: "Hey",
    title: "React",
};
function getTitle(title) {
    return title;
}
function App() {
    const title = "React LL";
    return (
        <div>
            <h1>
                {welcome.greeting} {welcome.title} {getTitle("dudu")}
            </h1>
            <label htmlfor="search">Search</label>
            <input id="search" type="text" />
        </div>
    );
}

export default App;
