/**
 * 拓扑关系图
 * 连线类
 * @author: Zhulinghao
 * @date: 2018-5-8
 */

import { portDelta } from './enum';
import * as util from './util';
import * as d3 from 'd3';

class Line {
  constructor(params) {
    this.container = params.container;
    this.id = util.makeId();
    this.fromPortType = params.fromPortType;
    this.fromItem = params.fromItem;
    this.targetItem = params.targetItem;
    this.targetPortType = params.targetPortType;
    this.path = null;

    // 回调事件
    this.onClick = params.onClick;

    this._createElement();
    this._bindEvent();
  }

  /**
   * 绘制连线
   * @param _targetPosition 目标坐标，如果targetPosition未传直接使用targetPort的坐标
   */
  updatePath(_targetPosition) {
    let fromPortPosition = this._getPortPosition(this.fromPortType, this.fromItem);
    let targetPosition =
      _targetPosition || this._getPortPosition(this.targetPortType, this.targetItem);
    let path = d3.path();
    let deltaX = fromPortPosition.x - targetPosition.x;
    let bezierX = deltaX * 0.5;
    if (
      (this.fromPortType === 'input' && deltaX > 0) ||
      (this.fromPortType === 'output' && deltaX < 0)
    ) {
      bezierX = -bezierX;
    }
    path.moveTo(fromPortPosition.x, fromPortPosition.y);
    path.lineTo(
      (targetPosition.x + fromPortPosition.x) / 2,
      (targetPosition.y + fromPortPosition.y) / 2
    );
    path.lineTo(targetPosition.x, targetPosition.y);
    // path.bezierCurveTo(
    //   fromPortPosition.x,
    //   // fromPortPosition.x + bezierX,
    //   fromPortPosition.y,
    //   // targetPosition.x - bezierX,
    //   targetPosition.x,
    //   targetPosition.y,
    //   targetPosition.x,
    //   targetPosition.y
    // );
    // this.path.attr('d', `M${fromPortPosition.x},${fromPortPosition.y}C225,298,225,226,298,226`);
    this.path.attr('d', path);
    this.path
      // .attr('marker-start', 'url(#arrow)')
      .attr('marker-mid', 'url(#arrow)');
    // .attr('marker-end', 'url(#arrow)');
  }

  /**
   * 删除连线
   */
  remove() {
    this.path.remove();
    if (this.fromItem && this.targetItem) {
      this.fromItem[this.fromPortType + 'Ids'].delete(this.targetItem.id);
      this.fromItem[this.fromPortType + 'PathIds'].delete(this.id);
      this.targetItem[this.targetPortType + 'Ids'].delete(this.fromItem.id);
      this.targetItem[this.targetPortType + 'PathIds'].delete(this.id);
    }
  }

  /**
   * 取消选中
   */
  blur() {
    this.path.classed('active', false);
  }

  /**
   * 创建线条元素
   * @private
   */
  _createElement() {
    this.path = this.container
      .append('path')
      .attr('class', 'line')
      .lower();
  }

  /**
   * 绑定事件
   * @private
   */
  _bindEvent() {
    this.path.on('mouseover', this._onMouseover.bind(this));
    this.path.on('mouseout', this._onMouseout.bind(this));
    this.path.on('click', this._onClick.bind(this));
  }

  /**
   * 点击事件
   * @private
   */
  _onMouseout() {
    this.blur();
  }
  _onMouseover() {
    d3.event.stopPropagation();
    this.path.classed('active', true);
    this.onClick(this);
  }
  _onClick() {
    d3.event.stopPropagation();
    // this.onClick(this)
    this.remove();
  }

  /**
   * 获取具柄的坐标
   * @param type 具柄类型（input/output）
   * @param item 元素对象
   * @returns {{x: *, y: *}}
   * @private
   */
  _getPortPosition(type, item) {
    let delta = {
      x: type === 'input' ? portDelta.INPUT_X : item.getItemWidth(),
      y: portDelta.Y,
    };
    return {
      x: item.x + delta.x,
      y: item.y + delta.y,
    };
  }
}

export default Line;
