<template>
  <div id="topo-container">
    <item-list id="item-list-left"></item-list>
    <div id="chart-container">
      <div class="toolbar">
        <el-button size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="save()">保存</el-button>
      </div>
      <svg id="topo-chart" width="5000" height="5000"></svg>
    </div>

    <dialog-device v-if="dialog.DEVICE" :item="editItem" @on-close="onCloseDialog"></dialog-device>
    <dialog-custom-data
      v-if="dialog.CUSTOM_DATA"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-custom-data>
    <dialog-logic-rule
      v-if="dialog.LOGIC_RULE"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-logic-rule>
    <dialog-arithmetic
      v-if="dialog.ARITHMETIC"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-arithmetic>
    <dialog-app v-if="dialog.APP" :item="editItem" @on-close="onCloseDialog"></dialog-app>
    <dialog-email v-if="dialog.EMAIL" :item="editItem" @on-close="onCloseDialog"></dialog-email>
    <dialog-http v-if="dialog.HTTP" :item="editItem" @on-close="onCloseDialog"></dialog-http>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Chart from './chart';
import itemList from './item-list.vue';
import dialogDevice from './dialog/device.vue';
import dialogCustomData from './dialog/custom_data.vue';
import dialogLogicRule from './dialog/logic_rule.vue';
import dialogArithmetic from './dialog/arithmetic.vue';
import dialogApp from './dialog/app.vue';
import dialogEmail from './dialog/email.vue';
import dialogHttp from './dialog/http.vue';
import './dialog/_dialog.scss';

let chart = null;
export default {
  components: {
    itemList,
    dialogDevice,
    dialogCustomData,
    dialogLogicRule,
    dialogArithmetic,
    dialogApp,
    dialogEmail,
    dialogHttp,
  },
  name: 'topo',
  data() {
    return {
      editItem: null,
      dialog: {
        DEVICE: false,
        CUSTOM_DATA: false,
        LOGIC_RULE: false,
        ARITHMETIC: false,
        APP: false,
        HTTP: false,
        EMAIL: false,
      },
    };
  },
  mounted() {
    let container = d3.select('#topo-chart');
    // 箭头
    var defs = container.append('defs');
    var arrowMarker = defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', '8')
      .attr('markerHeight', '8')
      .attr('viewBox', '0 0 12 12')
      .attr('refX', '13')
      .attr('refY', '6')
      .attr('orient', 'auto');
    arrowMarker
      .append('path')
      .attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2')
      .attr('fill', '#999');

    chart = new Chart({
      container: container,
      onItemDblclick: this.onItemDblclick,
    });

    this.loadData();
    this.bindDragEvent();

    //      chart.addItem({
    //        x: 85,
    //        y: 100,
    //        name: 'CUSTOM_DATA',
    //        type: 'INPUT'
    //      })
    //      chart.addItem({
    //        x: 455,
    //        y: 100,
    //        name: 'EMAIL',
    //        type: 'ACTION'
    //      })
    //      chart.addItem({
    //        x: 255,
    //        y: 250,
    //        name: 'LOGIC_RULE',
    //        type: 'FUNCTION'
    //      })
  },
  methods: {
    bindDragEvent() {
      let dragDeltaX, dragDeltaY, dragItem, $dragItem;
      let $container = document.getElementById('chart-container');
      let items = d3.selectAll('.item-list .item');
      let drag = d3
        .drag()
        .on('start', function() {
          let mousePosition = d3.mouse(this);
          dragDeltaX = mousePosition[0];
          dragDeltaY = mousePosition[1];
          dragItem = this.cloneNode(true);
          document.getElementsByTagName('body')[0].append(dragItem);
          $dragItem = d3.select(dragItem);

          getItemPosition(
            $dragItem,
            d3.event.sourceEvent.x - dragDeltaX + window.pageXOffset,
            d3.event.sourceEvent.y - dragDeltaY + window.pageYOffset
          );
        })
        .on('drag', function() {
          getItemPosition(
            $dragItem,
            d3.event.sourceEvent.x - dragDeltaX + window.pageXOffset,
            d3.event.sourceEvent.y - dragDeltaY + window.pageYOffset
          );
        })
        .on('end', function() {
          let position = {
            x:
              d3.event.sourceEvent.x -
              dragDeltaX -
              $container.offsetLeft -
              $container.offsetParent.offsetLeft +
              window.pageXOffset,
            y:
              d3.event.sourceEvent.y -
              dragDeltaY -
              $container.offsetTop -
              $container.offsetParent.offsetTop +
              window.pageYOffset,
          };
          if (position.x > 0) {
            chart.addItem({
              x: position.x,
              y: position.y,
              name: $dragItem.attr('data-name'),
              type: $dragItem.attr('data-type'),
            });
          }
          $dragItem.remove();
        });
      items.call(drag);

      let getItemPosition = function($item, x, y) {
        $item.attr('style', `position:absolute;left:0;top:0;transform:translate(${x}px, ${y}px)`);
      };
    },
    save() {
      console.log(chart.getItems());
      // 项目中替换为持久存储
      localStorage.setItem('items', JSON.stringify(chart.getItems()));
    },
    loadData() {
      // console.log(JSON.parse(localStorage.getItem('items')))
      chart.setItems(JSON.parse(localStorage.getItem('items')));
    },
    onItemDblclick(item) {
      this.editItem = item;
      this.dialog[item.name] = true;
    },
    onCloseDialog(item) {
      this.dialog[item.name] = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#topo-container {
  position: relative;
  width: 800px;
  height: 400px;
}
.toolbar {
  position: absolute;
  right: 10px;
  top: 10px;
}

#item-list-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 160px;
  border: 1px solid #ccc;
}

#chart-container {
  position: absolute;
  top: 0;
  left: 170px;
  bottom: 0;
  right: 0;
  border: 1px solid #ccc;
  background: #f3f3f3;
  overflow: hidden;
}

#topo-chart {
  cursor: crosshair;

  ::v-deep .item {
    cursor: move;

    &.active .item-rect {
      stroke: #999;
      stroke-width: 1px;
      stroke-dasharray: 5px;
    }
  }

  ::v-deep .item_label {
    font-size: 13px;
    fill: #fff;
    stroke-width: 0;
    user-select: none;
  }

  ::v-deep .port {
    fill: #ddd;
    stroke: #999;
    stroke-width: 1;
    cursor: crosshair;
  }

  ::v-deep .port-hovered {
    fill: #ff7f0e;
    stroke: #ff7f0e;
  }

  ::v-deep .line {
    fill: none;
    stroke: #999;
    stroke-width: 3px;

    &.active {
      stroke: #ff7f0e;
    }
  }
}
</style>
