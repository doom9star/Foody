import React, { useCallback, useRef, useState } from "react";
import Back from "../components/Back";
import { MenuType } from "../types";
import produce from "immer";
import { CAxios } from "../constants";
import { useNavigate } from "react-router-dom";

type Info = {
  name: string;
  address: string;
  menuType: MenuType;
  categories: {
    [k: string]: { name: string; price: number }[];
  };
  contact: string[];
};

function NewRestaurant() {
  const [info, setInfo] = useState<Info>({
    name: "",
    address: "",
    menuType: MenuType.SINGLE,
    categories: { DEFAULT: [] },
    contact: [""],
  });
  const [item, setItem] = useState<{
    name: string;
    price: number;
    category?: string;
  }>({
    name: "",
    price: 0,
    category: "",
  });

  const navigate = useNavigate();

  const categoryInputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback((event: React.ChangeEvent<any>) => {
    setInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    if (event.target.name === "menuType") {
      if (event.target.value === MenuType.SINGLE) {
        setInfo((prev) =>
          produce(prev, (draft) => {
            draft.categories = { DEFAULT: [] };
          })
        );
      } else {
        setInfo((prev) =>
          produce(prev, (draft) => {
            draft.categories = {};
          })
        );
      }
    }
  }, []);

  const onCreate = () => {
    CAxios.post("/restaurant", info).then(() => {
      navigate("/home", { replace: true });
    });
  };

  return (
    <div>
      <Back />
      <h1>Create A New Restaurant: </h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={info.name}
          onChange={onChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          rows={5}
          value={info.address}
          onChange={onChange}
        ></textarea>
        <h5>Contact</h5>
        <div>
          <div>
            <input
              type={"number"}
              placeholder="Contact No-1"
              value={info.contact[0]}
              onChange={(e) =>
                setInfo((prev) =>
                  produce(prev, (draft) => {
                    draft.contact[0] = e.target.value;
                  })
                )
              }
            />
            <button
              onClick={() => {
                setInfo((prev) =>
                  produce(prev, (draft) => {
                    draft.contact.push("");
                  })
                );
              }}
            >
              +
            </button>
          </div>
          {info.contact.map((c, idx) =>
            idx > 0 ? (
              <div key={idx}>
                <input
                  type={"number"}
                  placeholder={`Contact No-${idx + 1}`}
                  value={c}
                  onChange={(e) =>
                    setInfo((prev) =>
                      produce(prev, (draft) => {
                        draft.contact[idx] = e.target.value;
                      })
                    )
                  }
                />
                <button
                  onClick={() => {
                    setInfo((prev) =>
                      produce(prev, (draft) => {
                        draft.contact = draft.contact.filter(
                          (_, _idx) => _idx !== idx
                        );
                      })
                    );
                  }}
                >
                  -
                </button>
              </div>
            ) : null
          )}
        </div>
        <h5>Type of Menu</h5>
        <select name="menuType" value={info.menuType} onChange={onChange}>
          <option value={"SINGLE"}>SINGLE</option>
          <option value={"GROUP"}>GROUP</option>
        </select>
        <h5>Menu</h5>
        {info.menuType === MenuType.SINGLE ? (
          <div>
            <div>
              <input
                type={"text"}
                placeholder="Name"
                value={item.name}
                onChange={(e) => {
                  setItem((prev) => ({ ...prev, name: e.target.value }));
                }}
              />
              <input
                type={"number"}
                placeholder="Price"
                value={item.price}
                onChange={(e) => {
                  setItem((prev) => ({
                    ...prev,
                    price: parseInt(e.target.value),
                  }));
                }}
              />
              <button
                onClick={() => {
                  setInfo((prev) =>
                    produce(prev, (draft) => {
                      draft.categories.DEFAULT.push(item);
                    })
                  );
                  setItem({ name: "", price: 0 });
                }}
              >
                Add Item
              </button>
            </div>
            <table style={{ padding: "1rem" }}>
              {info.categories["DEFAULT"].map((i, idx) => (
                <tr key={idx}>
                  <td>{i.name}</td>
                  <td>₹{i.price}</td>
                  <td>
                    <button
                      onClick={() => {
                        setInfo((prev) =>
                          produce(prev, (draft) => {
                            draft.categories.DEFAULT =
                              draft.categories.DEFAULT.filter(
                                (_, _idx) => _idx !== idx
                              );
                          })
                        );
                      }}
                    >
                      remove
                    </button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        ) : (
          <div>
            <div>
              <input
                type={"text"}
                placeholder="Name of Category"
                ref={categoryInputRef}
              />
              <button
                onClick={() => {
                  if (categoryInputRef.current?.value) {
                    setInfo((prev) =>
                      produce(prev, (draft) => {
                        draft.categories[categoryInputRef.current!.value] = [];
                      })
                    );
                  }
                }}
              >
                Add Category
              </button>
            </div>
            {JSON.stringify(info.categories) !== "{}" && (
              <div>
                <input
                  type={"text"}
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) => {
                    setItem((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
                <input
                  type={"number"}
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => {
                    setItem((prev) => ({
                      ...prev,
                      price: parseInt(e.target.value),
                    }));
                  }}
                />
                <select
                  value={item.category}
                  onChange={(e) =>
                    setItem((prev) => ({ ...prev, category: e.target.value }))
                  }
                >
                  {Object.keys(info.categories).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setInfo((prev) =>
                      produce(prev, (draft) => {
                        draft.categories[
                          item.category || Object.keys(draft.categories)[0]
                        ].push(item);
                      })
                    );
                    setItem({ name: "", price: 0, category: "" });
                  }}
                >
                  Add Item
                </button>
              </div>
            )}
            <div>
              {Object.entries(info.categories).map(([name, items]) => (
                <div key={name}>
                  <h6>
                    {name}{" "}
                    <button
                      onClick={() => {
                        setInfo((prev) =>
                          produce(prev, (draft) => {
                            delete draft.categories[name];
                          })
                        );
                      }}
                    >
                      x
                    </button>
                  </h6>
                  <table>
                    {items.map((i, idx) => (
                      <tr key={i.name}>
                        <td>{i.name}</td>
                        <td>₹{i.price}</td>
                        <td>
                          <button
                            onClick={() => {
                              setInfo((prev) =>
                                produce(prev, (draft) => {
                                  draft.categories[name] = draft.categories[
                                    name
                                  ].filter((_, _idx) => _idx !== idx);
                                })
                              );
                            }}
                          >
                            remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={onCreate} style={{ margin: "4rem" }}>
          Create
        </button>
      </div>
    </div>
  );
}

export default NewRestaurant;
