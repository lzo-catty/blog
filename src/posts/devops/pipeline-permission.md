---
title: Azure DevOps Pipeline的权限
icon: pen-to-square
date: 2025-08-13
order: 1
author: Rain Man
# this page is sticky in article list
sticky: true
# this page will appear in starred articles
star: true
category:
  - DevOps
---

在 Azure DevOps 的 **Pipeline Security** 中，有 **Azure DevOps Groups** 和 **Users** 两块，它们的区别和关联如下：

------

## 1. **Users（用户）**

- 指单个的 Azure DevOps 用户账号。
- 权限是针对这个具体用户单独设置的。
- 设置允许或拒绝权限后，只影响该用户。
- 适用于你只想控制某个具体人的权限，而不影响其他人。

------

## 2. **Azure DevOps Groups（组）**

- 指一个用户集合，可以是项目组、团队组、系统默认组（例如 **Contributors**, **Project Administrators**, **Build Administrators**）。
- 权限赋给组后，组内的所有用户都会继承该权限（除非单独用户被 Deny）。
- 方便批量管理权限，减少重复操作。
- 组权限优先级：
    - **Deny > Allow > Not set**
    - 如果一个用户在组里被 Allow，但自己单独被 Deny，则 Deny 生效。

------

## 3. **关联关系**

- 用户可以属于一个或多个组。
- 用户的最终权限 = 各组权限 + 用户自身权限：
    - 如果某个权限在任意组被 Deny，则 Deny 优先。
    - 如果某个权限在用户自己被 Allow，且组中没 Deny，则 Allow 生效。
    - 没设置的权限默认继承上级（项目或组织层）权限。

------

## 举例说明

| 用户/组                 | Edit Pipeline 权限                    |
| ----------------------- | ------------------------------------- |
| Alice (单独用户)        | Not Set                               |
| Contributors（组）      | Allow                                 |
| Alice 属于 Contributors | 实际权限 = Allow                      |
| Alice 单独被 Deny       | 实际权限 = Deny（优先级高于组 Allow） |



------

### 总结

- **Users**：单独控制某个账号。
- **Groups**：批量控制用户集合，方便管理。
- **关联**：用户权限 = 用户权限 + 所属组权限，Deny 优先于 Allow。
