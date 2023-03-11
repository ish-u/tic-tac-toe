import { StatusBar } from "expo-status-bar";
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";

// const Circle = ({ x, y, setBgColor }: { x: number; y: number; setBgColor: (value: string) => void }) => {
//   const startValue = useRef(new Animated.Value(0)).current;
//   const [color, setColor] = useState("#000");
//   const toggleColor = () => {
//     if (color === "#000") {
//       setBgColor("#000");
//       setColor("#fff");
//     } else {
//       setBgColor("#fff");
//       setColor("#000");
//     }
//   };
//   const endValue = 50;
//   const duration = 1000;
//   const positionStyle = StyleSheet.create({
//     square: {
//       height: 150,
//       width: 150,
//       backgroundColor: color,
//       borderRadius: 1000,
//       position: "absolute",
//       top: y,
//       left: x,
//       zIndex: 10,
//     },
//   });

//   useEffect(() => {
//     console.log(color, x, y);
//     Animated.timing(startValue, {
//       toValue: endValue,
//       duration: duration,
//       useNativeDriver: true,
//     }).start(() => {
//       startValue.setValue(0.0045);
//       toggleColor();
//     });
//   }, [x, y, startValue]);

//   return (
//     <TouchableNativeFeedback>
//       <View>
//         <Animated.View
//           style={[
//             positionStyle.square,
//             {
//               transform: [
//                 {
//                   scale: startValue,
//                 },
//               ],
//             },
//           ]}
//         ></Animated.View>
//       </View>
//     </TouchableNativeFeedback>
//   );
// };

// export function _App() {
//   const [bgColor, setBgColor] = useState("#000");
//   const [x, setX] = useState(100);
//   const [y, setY] = useState(10);

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: bgColor,
//       // alignItems: "center",
//       // justifyContent: "center",
//       borderColor: "black",
//       zIndex: 10,
//       // position: "relative",
//     },
//   });

//   return (
//     <Pressable
//       style={styles.container}
//       onPress={(e) => {
//         setX(e.nativeEvent.pageX);
//         setY(e.nativeEvent.pageY);
//       }}
//     >
//       <Circle x={x} y={y} setBgColor={setBgColor} />
//       {/* <StatusBar style="light" /> */}
//     </Pressable>
//   );
// }

const checkWinner = (
  boardState: BoardState["boardState"]
): BoardState["winner"] => {
  // Row Wise
  for (let i = 0; i < 3; i++) {
    if (
      boardState[i][0] === -1 &&
      boardState[i][1] === -1 &&
      boardState[i][2] === -1
    ) {
      return "X";
    }
    if (
      boardState[i][0] === 1 &&
      boardState[i][1] === 1 &&
      boardState[i][2] === 1
    ) {
      return "O";
    }
  }

  // Col Wise
  for (let i = 0; i < 3; i++) {
    if (
      boardState[0][i] === -1 &&
      boardState[1][i] === -1 &&
      boardState[2][i] === -1
    ) {
      return "X";
    }

    if (
      boardState[0][i] === 1 &&
      boardState[1][i] === 1 &&
      boardState[2][i] === 1
    ) {
      return "O";
    }
  }

  // Cross Wise
  if (
    (boardState[0][0] === -1 &&
      boardState[1][1] === -1 &&
      boardState[2][2] === -1) ||
    (boardState[0][2] === -1 &&
      boardState[1][1] === -1 &&
      boardState[2][0] === -1)
  ) {
    return "X";
  }

  if (
    (boardState[0][0] === 1 &&
      boardState[1][1] === 1 &&
      boardState[2][2] === 1) ||
    (boardState[0][2] === 1 && boardState[1][1] === 1 && boardState[2][0] === 1)
  ) {
    return "O";
  }

  // In Progress
  for (let row of boardState) {
    for (let col of row) {
      if (col === 0) {
        return "IN_PROGRESS";
      }
    }
  }

  return "TIE";
};

// Context
// state
interface BoardState {
  boardState: BoardBoxValue[][];
  player: "X" | "O";
  winner: "X" | "O" | "TIE" | "IN_PROGRESS";
}
// actions
enum BoardActionType {
  PlayMove,
  ResetBoard,
}
interface PlayMove {
  type: BoardActionType.PlayMove;
  payload: {
    position: {
      i: 0 | 1 | 2;
      j: 0 | 1 | 2;
    };
  };
}
interface ResetBoard {
  type: BoardActionType.ResetBoard;
  payload: {};
}
type BoardActions = PlayMove | ResetBoard;
// redurcer
export const BoardReducer = (
  state: BoardState,
  action: BoardActions
): BoardState => {
  switch (action.type) {
    case BoardActionType.PlayMove:
      const { position } = action.payload;
      const newBoardState: BoardState["boardState"] = JSON.parse(
        JSON.stringify(state.boardState)
      );
      if (newBoardState[position.i][position.j] === 0) {
        const move: BoardBoxValue = state.player === "O" ? 1 : -1;
        const nextPlayer: BoardState["player"] =
          state.player === "O" ? "X" : "O";
        newBoardState[position.i][position.j] = move;
        return {
          ...state,
          boardState: newBoardState,
          player: nextPlayer,
          winner: checkWinner(newBoardState),
        };
      }
      return state;
    case BoardActionType.ResetBoard:
      return {
        boardState: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        winner: "IN_PROGRESS",
        player: "O",
      };
  }
};
// context
export const BoardContext = createContext<{
  state: BoardState;
  dispatch: React.Dispatch<BoardActions>;
}>({
  state: {
    boardState: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    player: "O",
    winner: "IN_PROGRESS",
  },
  dispatch: () => null,
});

// provider
export const BoardProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [state, dispatch] = useReducer(BoardReducer, {
    boardState: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    player: "O",
    winner: "IN_PROGRESS",
  } as BoardState);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

// Board
// Players
// Board Tile
// checkWinning
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "steelblue",
    alignContent: "center",
    alignItems: "center",
  },
  board: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    rowGap: 10,
    columnGap: 10,
    backgroundColor: "black",
    width: 320,
    height: 320,
  },
  boardBox: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    backgroundColor: "steelblue",
  },
  cross: {
    fontSize: 40,
    fontWeight: "900",
  },
  circle: {
    fontSize: 40,
    fontWeight: "900",
  },
  winnerBanner: {
    position: "absolute",
    top: 100,
  },
  winnerText: {
    fontSize: 40,
    fontWeight: "500",
  },
});

const Cross = () => {
  return (
    <View>
      <Text style={styles.cross}>X</Text>
    </View>
  );
};

const Circle = () => {
  return (
    <View>
      <Text style={styles.circle}>O</Text>
    </View>
  );
};

const BoardBox = ({ i, j }: { i: 0 | 1 | 2; j: 0 | 1 | 2 }) => {
  const { state, dispatch } = useContext(BoardContext);
  const playMove = () => {
    dispatch({
      type: BoardActionType.PlayMove,
      payload: {
        position: {
          i: i,
          j: j,
        },
      },
    });
  };

  return (
    <Pressable onPress={playMove}>
      <View style={styles.boardBox}>
        {state.boardState[i][j] === -1 && <Cross />}
        {state.boardState[i][j] === 0 && <></>}
        {state.boardState[i][j] === 1 && <Circle />}
      </View>
    </Pressable>
  );
};

type BoardBoxValue = 1 | 0 | -1;

const Board = () => {
  const { state } = useContext(BoardContext);

  return (
    <View style={styles.board}>
      {state.boardState &&
        state.boardState.map((row, i) =>
          row.map((col, j) => (
            // @ts-ignore
            <BoardBox i={i} j={j} key={i + j} />
          ))
        )}
    </View>
  );
};

const WinnerBanner = () => {
  const { state, dispatch } = useContext(BoardContext);
  useEffect(() => {
    if (state.winner !== "IN_PROGRESS") {
      const reset = setTimeout(() => {
        dispatch({
          type: BoardActionType.ResetBoard,
          payload: {},
        });
      }, 2000);
      return () => clearTimeout(reset);
    }
  }, [state.winner]);
  return (
    <View style={styles.winnerBanner}>
      {state.winner === "O" && <Text style={styles.winnerText}> O Wins </Text>}
      {state.winner === "X" && <Text style={styles.winnerText}> X Wins </Text>}
      {state.winner === "TIE" && <Text style={styles.winnerText}> Tie </Text>}
    </View>
  );
};

export default function App() {
  return (
    <BoardProvider>
      <View style={styles.container}>
        <WinnerBanner />
        <Board />
      </View>
    </BoardProvider>
  );
}
