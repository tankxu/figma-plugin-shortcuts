# Custom Actions Guide

## 概述
Custom Actions 功能允许你创建自定义的 Figma 操作，通过快捷键触发执行。

## 如何创建 Custom Action

1. 在插件界面点击 "Configure Shortcuts"
2. 切换到 "Custom Actions" 标签页
3. 点击 "+ Add Custom Action" 按钮
4. 填写以下信息：
   - **Action Name**: 操作名称（例如："Set Corner Radius 8"）
   - **Action Function**: JavaScript 函数代码
   - **Shortcut**: 设置快捷键（可选）

## JavaScript 函数编写指南

### 基本语法
你的函数将接收两个参数：
- `figma`: Figma API 对象
- `selection`: 当前选中的节点数组

### 示例代码

#### 1. 设置圆角半径
```javascript
selection.forEach(node => {
  if ('cornerRadius' in node) {
    node.cornerRadius = 8;
  }
});
```

#### 2. 设置填充颜色
```javascript
selection.forEach(node => {
  if ('fills' in node) {
    node.fills = [{
      type: 'SOLID',
      color: { r: 1, g: 0, b: 0 }
    }];
  }
});
```

#### 3. 设置描边颜色
```javascript
selection.forEach(node => {
  if ('strokes' in node) {
    node.strokes = [{
      type: 'SOLID',
      color: { r: 0, g: 0, b: 1 }
    }];
  }
});
```

#### 4. 设置字体大小
```javascript
selection.forEach(node => {
  if ('fontSize' in node) {
    node.fontSize = 16;
  }
});
```

#### 5. 设置自动布局间距
```javascript
selection.forEach(node => {
  if ('itemSpacing' in node) {
    node.itemSpacing = 8;
  }
});
```

#### 6. 复制并粘贴节点
```javascript
const copiedNodes = [];
selection.forEach(node => {
  const clone = node.clone();
  clone.x += 100;
  copiedNodes.push(clone);
});
figma.currentPage.appendChild(copiedNodes[0]);
```

## 注意事项

1. **错误处理**: 始终检查节点是否具有特定属性，使用 `'propertyName' in node` 进行检查
2. **类型安全**: 某些操作可能只在特定类型的节点上有效
3. **性能**: 避免在函数中执行过于复杂的操作
4. **调试**: 使用 `console.log()` 进行调试，错误信息会显示在通知中

## 常见错误

- **"Cannot read property of undefined"**: 检查节点是否具有所需属性
- **"Property does not exist"**: 确认属性名称正确
- **"Invalid value"**: 检查传入的值是否符合 Figma API 要求

## 高级用法

### 条件操作
```javascript
selection.forEach(node => {
  if (node.type === 'RECTANGLE') {
    if ('cornerRadius' in node) {
      node.cornerRadius = 8;
    }
  } else if (node.type === 'TEXT') {
    if ('fontSize' in node) {
      node.fontSize = 14;
    }
  }
});
```

### 批量操作
```javascript
const selectedNodes = selection;
if (selectedNodes.length > 0) {
  // 对第一个节点执行操作
  const firstNode = selectedNodes[0];
  if ('cornerRadius' in firstNode) {
    firstNode.cornerRadius = 12;
  }
  
  // 对剩余节点执行相同操作
  selectedNodes.slice(1).forEach(node => {
    if ('cornerRadius' in node) {
      node.cornerRadius = 12;
    }
  });
}
```

## 视觉标识

在插件界面中，Custom Actions 会有以下视觉标识：
- ⚡ 图标前缀
- 蓝色左边框
- 在主页和配置页面都有特殊样式

这样你就可以轻松识别哪些是自定义操作，哪些是内置操作。 