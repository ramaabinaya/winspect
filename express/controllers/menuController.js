

const getMenuList = async function (req, res) {
  [err, menu] = await to(MenuItems.findAll({
    where: { mainMenuId: null },
    attributes: { exclude: ['created', 'modified'] },
    include: [
      {
        required: true,
        model: RoleBasedMenu,
        where: {
          userRoleId: req.user.userRoleId,
          permissionId: CONFIG.readPermissionId
        },
        attributes: { exclude: ['id', 'userRoleId', 'menuItemId', 'created', 'modified'] }
      }, {
        model: MenuItems,
        as: 'subMenu',
        attributes: { exclude: ['created', 'modified'] },
        include: [{
          required: true,
          model: RoleBasedMenu,
          where: {
            userRoleId: req.user.userRoleId,
            permissionId: CONFIG.readPermissionId
          },
          attributes: { exclude: ['id', 'userRoleId', 'menuItemId', 'created', 'modified'] }
        }]
      }],
    order: [
      ['displayPosition', 'asc'],
      [{ model: MenuItems, as: 'subMenu' }, 'displayPosition', 'asc']
    ]
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { menu: menu, userRole: req.user.userRole });
}
module.exports.getMenuList = getMenuList;