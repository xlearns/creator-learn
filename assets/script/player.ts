import {
  _decorator,
  Component,
  Node,
  macro,
  RigidBody,
  RigidBody2D,
  Vec2,
  Collider2D,
  Contact2DType,
  PhysicsSystem2D,
} from "cc";
import { Input } from "./Input";
const myInput = Input.instance;

const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  private can_jump = true;
  onLoad() {
    //设置重力
    PhysicsSystem2D.instance.gravity = new Vec2(0, -600);

    let collider = this.getComponent(Collider2D);
    collider?.on(
      Contact2DType.BEGIN_CONTACT,
      () => {
        this.can_jump = true;
      },
      this
    );
  }
  update() {
    let speed = 8;
    let jump_speed = 16;
    let rb = this.getComponent(RigidBody2D);
    let lv = rb!.linearVelocity;
    let grivity = PhysicsSystem2D.instance.gravity;

    if (myInput.is_action_pressed(macro.KEY.a)) {
      lv.x = -speed;
    } else if (myInput.is_action_pressed(macro.KEY.d)) {
      lv.x = speed;
    } else {
      lv = new Vec2(0, lv.y);
    }

    if (myInput.is_action_just_pressed(macro.KEY.w) && this.can_jump) {
      if (grivity.y < 0) {
        lv.y = jump_speed;
      } else {
        lv.y = -jump_speed;
      }
      this.can_jump = false;
    }

    //反重力
    if (myInput.is_action_just_pressed(macro.KEY.space)) {
      PhysicsSystem2D.instance.gravity = new Vec2(grivity.x, -grivity.y);
    }
    rb!.linearVelocity = lv;
  }
}
