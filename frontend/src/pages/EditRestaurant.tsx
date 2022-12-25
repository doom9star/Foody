import produce from "immer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Back from "../components/Back";
import { CAxios } from "../constants";
import { ICategory, MenuType, RestaurantStatus } from "../types";
import { isObject } from "../utils";

type Info = {
  name: string;
  address: string;
  contact: string[];
  status: RestaurantStatus;
  menuModified: boolean;
  menuType: MenuType;
  categories: ICategory[];
};

function EditRestaurant() {
  const [info, setInfo] = useState<Info>({
    name: "",
    address: "",
    contact: [],
    status: RestaurantStatus.OPEN,
    menuModified: false,
    menuType: MenuType.SINGLE,
    categories: [],
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
  const [loading, setLoading] = useState(true);

  const categoryInputRef = useRef<HTMLInputElement>(null);

  const params = useParams();
  const navigate = useNavigate();

  const onChange = useCallback((event: React.ChangeEvent<any>) => {
    setInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    if (event.target.name === "menuType") {
      setInfo((prev) =>
        produce(prev, (draft) => {
          draft.menuType = event.target.value;
          draft.menuModified = true;
          draft.categories =
            event.target.value === MenuType.SINGLE
              ? [{ name: "DEFAULT" } as any]
              : [];
        })
      );
    }
  }, []);

  const onEdit = useCallback(() => {
    CAxios.put("/restaurant", { id: params.id, ...info }).then(() => {
      navigate(-1);
    });
  }, [info, navigate, params]);

  useEffect(() => {
    CAxios.get(`/restaurant/one/${params.id}`, {
      params: { id: params.id },
    }).then(({ data }) => {
      setLoading(false);
      if (isObject(data) && JSON.stringify(data) !== "{}") {
        setInfo({
          name: data.name,
          address: data.address,
          contact: data.contact,
          status: data.status,
          menuModified: false,
          menuType: data.menuType,
          categories: data.categories,
        });
      } else {
        navigate(-1);
      }
    });
  }, [params, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Back />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", padding: "1rem 0rem" }}>
          <div>
            <input
              type="radio"
              id="open"
              name="status"
              value={RestaurantStatus.OPEN}
              checked={info.status === RestaurantStatus.OPEN}
              onChange={onChange}
            />
            <label htmlFor="open">OPEN</label>
          </div>
          <div>
            <input
              type="radio"
              id="closed"
              name="status"
              value={RestaurantStatus.CLOSED}
              checked={info.status === RestaurantStatus.CLOSED}
              onChange={onChange}
            />
            <label htmlFor="closed">CLOSED</label>
          </div>
        </div>
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
                        draft.menuModified = true;
                        draft.categories[0].items.push({
                          name: item.name,
                          price: item.price,
                        } as any);
                      })
                    );
                    setItem({ name: "", price: 0 });
                  }}
                >
                  Add
                </button>
              </div>
              <table style={{ padding: "1rem" }}>
                {info.categories[0].items.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.name}</td>
                    <td>₹{i.price}</td>
                    <td>
                      <button
                        onClick={() => {
                          setInfo((prev) =>
                            produce(prev, (draft) => {
                              draft.menuModified = true;
                              draft.categories[0].items =
                                draft.categories[0].items.filter(
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
                          draft.menuModified = true;
                          draft.categories.push({
                            name: categoryInputRef.current!.value,
                          } as any);
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
                          const cidx = item.category
                            ? info.categories.findIndex(
                                (c) => c.name === item.category
                              )
                            : 0;
                          draft.menuModified = true;
                          draft.categories[cidx].items.push(item as any);
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
                {info.categories.map((c, cidx) => (
                  <div key={c.name}>
                    <h6>
                      {c.name}{" "}
                      <button
                        onClick={() => {
                          setInfo((prev) =>
                            produce(prev, (draft) => {
                              draft.menuModified = true;
                              draft.categories = draft.categories.filter(
                                (_, _idx) => _idx !== cidx
                              );
                            })
                          );
                        }}
                      >
                        x
                      </button>
                    </h6>
                    <table>
                      {c.items.map((i, iidx) => (
                        <tr key={i.name}>
                          <td>{i.name}</td>
                          <td>₹{i.price}</td>
                          <td>
                            <button
                              onClick={() => {
                                setInfo((prev) =>
                                  produce(prev, (draft) => {
                                    draft.menuModified = true;
                                    draft.categories[cidx].items =
                                      draft.categories[cidx].items.filter(
                                        (_, _idx) => _idx !== iidx
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
                ))}
              </div>
            </div>
          )}
        </div>
        <button onClick={onEdit} style={{ margin: "4rem" }}>
          Edit
        </button>
      </div>
    </div>
  );
}

export default EditRestaurant;
