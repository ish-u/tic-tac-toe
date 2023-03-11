import { StatusBar } from "expo-status-bar";
import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import {
  Alert,
  Animated,
  Easing,
  GestureResponderEvent,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// check winner function
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

// App State
// ======================================================
// State
enum PlayerColors {
  XColor = "tomato",
  OColor = "royalblue",
}
type BoardBoxValue = 1 | 0 | -1;
interface BoardState {
  boardState: BoardBoxValue[][];
  player: "X" | "O";
  winner: "X" | "O" | "TIE" | "IN_PROGRESS";
  bgColor: PlayerColors.XColor | PlayerColors.OColor;
  position: {
    x: number;
    y: number;
  };
}
const initialState: BoardState = {
  boardState: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  player: "O",
  winner: "IN_PROGRESS",
  bgColor: PlayerColors.OColor,
  position: {
    x: 0,
    y: 0,
  },
};
// ==============================================

// Actions
// ==============================================
enum BoardActionType {
  PlayMove,
  ResetBoard,
  ChangeBackgroundColor,
}
interface PlayMove {
  type: BoardActionType.PlayMove;
  payload: {
    index: {
      i: 0 | 1 | 2;
      j: 0 | 1 | 2;
    };
    position: {
      x: number;
      y: number;
    };
  };
}
interface ResetBoard {
  type: BoardActionType.ResetBoard;
  payload: {};
}
interface ChangeBackgroundColor {
  type: BoardActionType.ChangeBackgroundColor;
  payload: {};
}
type BoardActions = PlayMove | ResetBoard | ChangeBackgroundColor;
// ==============================================

// Reducer Function
// ==============================================
export const BoardReducer = (
  state: BoardState,
  action: BoardActions
): BoardState => {
  switch (action.type) {
    case BoardActionType.PlayMove:
      const { index, position } = action.payload;
      const newBoardState: BoardState["boardState"] = JSON.parse(
        JSON.stringify(state.boardState)
      );
      if (
        newBoardState[index.i][index.j] === 0 &&
        state.winner === "IN_PROGRESS"
      ) {
        const move: BoardBoxValue = state.player === "O" ? 1 : -1;
        const nextPlayer: BoardState["player"] =
          state.player === "O" ? "X" : "O";
        newBoardState[index.i][index.j] = move;
        const winner = checkWinner(newBoardState);
        const newPosition =
          winner === "IN_PROGRESS" ? position : state.position;
        return {
          ...state,
          boardState: newBoardState,
          player: nextPlayer,
          winner: winner,
          position: newPosition,
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
        bgColor: PlayerColors.OColor,
        position: {
          x: 0,
          y: 0,
        },
      };
    case BoardActionType.ChangeBackgroundColor:
      if (state.winner === "IN_PROGRESS") {
        const bgColor =
          state.player === "O" ? PlayerColors.OColor : PlayerColors.XColor;
        return { ...state, bgColor: bgColor };
      }
      return state;
  }
};
// ==============================================

// Context
// ==============================================
const BoardContext = createContext<{
  state: BoardState;
  dispatch: React.Dispatch<BoardActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const BoardProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [state, dispatch] = useReducer(BoardReducer, initialState);
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};
// ==============================================

// Styles
// ==============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: PlayerColors.OColor,
    alignContent: "center",
    alignItems: "center",
    z: 1,
  },
  board: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    width: 320,
    height: 320,
    z: 1,
  },
  boardBox: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderColor: "black",
    z: 1,
  },
  cross: {
    fontSize: 75,
    fontWeight: "900",
  },
  circle: {
    fontSize: 75,
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
  link: {
    position: "absolute",
    bottom: 25,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    color: "snow",
    fontWeight: "500",
    fontSize: 10,
  },
});
// ==============================================

// Components
// ==============================================
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
  const playMove = (e: GestureResponderEvent) => {
    dispatch({
      type: BoardActionType.PlayMove,
      payload: {
        index: {
          i: i,
          j: j,
        },
        position: {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        },
      },
    });
  };

  return (
    <Pressable onPress={playMove}>
      <View
        style={{
          ...styles.boardBox,
          borderBottomWidth: i <= 1 ? 10 : 0,
          borderRightWidth: j <= 1 ? 10 : 0,
        }}
      >
        {state.boardState[i][j] === -1 && <Cross />}
        {state.boardState[i][j] === 0 && <></>}
        {state.boardState[i][j] === 1 && <Circle />}
      </View>
    </Pressable>
  );
};

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
      }, 1000);
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

const Ripple = () => {
  const startValue = useRef(new Animated.Value(0)).current;
  const { state, dispatch } = useContext(BoardContext);
  const endValue = 10;
  const duration = 200;
  const rippleStyle = StyleSheet.create({
    ripple: {
      height: 150,
      width: 150,
      backgroundColor:
        state.bgColor === PlayerColors.XColor
          ? PlayerColors.OColor
          : PlayerColors.XColor,
      borderRadius: 1000,
      position: "absolute",
      top: state.position.y - 75,
      left: state.position.x - 75,
      zIndex: -1,
    },
  });

  useEffect(() => {
    if (state.position.x !== 0 && state.position.y !== 0) {
      Animated.timing(startValue, {
        toValue: endValue,
        duration: duration,
        easing: Easing.circle,
        useNativeDriver: true,
      }).start(() => {
        startValue.setValue(0);
        dispatch({
          type: BoardActionType.ChangeBackgroundColor,
          payload: {},
        });
      });
    }
  }, [state.position]);

  return (
    <Animated.View
      style={[
        rippleStyle.ripple,
        {
          transform: [
            {
              scale: startValue,
            },
          ],
        },
      ]}
    ></Animated.View>
  );
};

const BoardView = () => {
  const { state } = useContext(BoardContext);
  return (
    <View style={{ ...styles.container, backgroundColor: state.bgColor }}>
      <WinnerBanner />
      <Board />
      <Ripple />
    </View>
  );
};

const Link = () => {
  const url = "https://github.com/ish-u";
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);
  return (
    <View style={styles.link}>
      <Text onPress={handlePress} style={styles.linkText}>
        github : ish-u
      </Text>
    </View>
  );
};
// ==============================================

// App
export default function App() {
  return (
    <BoardProvider>
      <StatusBar style="light" />
      <BoardView />
      <Link />
    </BoardProvider>
  );
}
