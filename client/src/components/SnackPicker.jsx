import { Coffee, Popcorn } from "lucide-react";
import { money } from "../utils/format.js";
import "./SnackPicker.css";

export function SnackPicker({ concessions, snacks, changeSnack }) {
  return (
    <section className="panel">
      <h2><Popcorn size={22} /> Snacks & Drinks</h2>
      <div className="concessions">
        {concessions.map((item) => (
          <article className="concession" key={item._id}>
            <img src={item.image} alt={item.name} />
            <div>
              <span>{item.category === "drink" ? <Coffee size={15} /> : <Popcorn size={15} />} {item.category}</span>
              <strong>{item.name}</strong>
              <small>{money(item.price)}</small>
            </div>
            <div className="stepper">
              <button onClick={() => changeSnack(item._id, -1)}>-</button>
              <b>{snacks[item._id] || 0}</b>
              <button onClick={() => changeSnack(item._id, 1)}>+</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
