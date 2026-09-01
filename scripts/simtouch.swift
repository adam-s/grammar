// Post real mouse events at global screen coordinates — the iOS Simulator
// turns them into genuine touches. Subcommands:
//   simtouch window            -> prints "x y w h" of the Simulator window
//   simtouch tap X Y           -> mouse down+up at global (X, Y)
//   simtouch drag X1 Y1 X2 Y2  -> down, move in steps, up
import AppKit
import CoreGraphics

func simulatorWindow() -> CGRect? {
  let list = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] ?? []
  for w in list {
    guard let owner = w[kCGWindowOwnerName as String] as? String, owner == "Simulator",
          let b = w[kCGWindowBounds as String] as? [String: CGFloat],
          let x = b["X"], let y = b["Y"], let wd = b["Width"], let ht = b["Height"],
          ht > 200 else { continue }
    return CGRect(x: x, y: y, width: wd, height: ht)
  }
  return nil
}

func post(_ type: CGEventType, _ p: CGPoint) {
  let ev = CGEvent(mouseEventSource: nil, mouseType: type, mouseCursorPosition: p, mouseButton: .left)
  ev?.post(tap: .cghidEventTap)
}

let args = CommandLine.arguments
switch args[1] {
case "window":
  guard let r = simulatorWindow() else { print("none"); exit(1) }
  print("\(Int(r.origin.x)) \(Int(r.origin.y)) \(Int(r.width)) \(Int(r.height))")
case "tap":
  let p = CGPoint(x: Double(args[2])!, y: Double(args[3])!)
  post(.mouseMoved, p); usleep(60000)
  post(.leftMouseDown, p); usleep(90000)
  post(.leftMouseUp, p)
case "drag":
  let a = CGPoint(x: Double(args[2])!, y: Double(args[3])!)
  let b = CGPoint(x: Double(args[4])!, y: Double(args[5])!)
  post(.mouseMoved, a); usleep(60000)
  post(.leftMouseDown, a); usleep(150000)
  for i in 1...12 {
    let t = Double(i) / 12.0
    post(.leftMouseDragged, CGPoint(x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t))
    usleep(30000)
  }
  usleep(200000)
  post(.leftMouseUp, b)
default:
  exit(2)
}
