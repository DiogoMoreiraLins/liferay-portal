/**
 * Copyright (c) 2000-2010 Liferay, Inc. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package com.liferay.portal.service.impl;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.MapUtil;
import com.liferay.portal.model.Group;
import com.liferay.portal.model.Organization;
import com.liferay.portal.model.UserGroup;
import com.liferay.portal.security.permission.ActionKeys;
import com.liferay.portal.security.permission.PermissionChecker;
import com.liferay.portal.service.ServiceContext;
import com.liferay.portal.service.base.GroupServiceBaseImpl;
import com.liferay.portal.service.permission.GroupPermissionUtil;
import com.liferay.portal.service.permission.PortalPermissionUtil;
import com.liferay.portal.service.permission.RolePermissionUtil;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * <a href="GroupServiceImpl.java.html"><b><i>View Source</i></b></a>
 *
 * @author Brian Wing Shun Chan
 */
public class GroupServiceImpl extends GroupServiceBaseImpl {

	public Group addGroup(
			String name, String description, int type, String friendlyURL,
			boolean active, ServiceContext serviceContext)
		throws PortalException, SystemException {

		PortalPermissionUtil.check(
			getPermissionChecker(), ActionKeys.ADD_COMMUNITY);

		return groupLocalService.addGroup(
			getUserId(), null, 0, name, description, type, friendlyURL, active,
			serviceContext);
	}

	public Group addGroup(
			long liveGroupId, String name, String description, int type,
			String friendlyURL, boolean active, ServiceContext serviceContext)
		throws PortalException, SystemException {

		GroupPermissionUtil.check(
			getPermissionChecker(), liveGroupId, ActionKeys.UPDATE);

		return groupLocalService.addGroup(
			getUserId(), null, 0, liveGroupId, name, description, type,
			friendlyURL, active, serviceContext);
	}

	public void addRoleGroups(long roleId, long[] groupIds)
		throws PortalException, SystemException {

		RolePermissionUtil.check(
			getPermissionChecker(), roleId, ActionKeys.UPDATE);

		groupLocalService.addRoleGroups(roleId, groupIds);
	}

	public void deleteGroup(long groupId)
		throws PortalException, SystemException {

		GroupPermissionUtil.check(
			getPermissionChecker(), groupId, ActionKeys.DELETE);

		groupLocalService.deleteGroup(groupId);
	}

	public Group getGroup(long groupId)
		throws PortalException, SystemException {

		return groupLocalService.getGroup(groupId);
	}

	public Group getGroup(long companyId, String name)
		throws PortalException, SystemException {

		return groupLocalService.getGroup(companyId, name);
	}

	public List<Group> getManageableGroups(String actionId, int max)
		throws PortalException, SystemException {

		PermissionChecker permissionChecker = getPermissionChecker();

		if (permissionChecker.isCompanyAdmin()) {
			return groupLocalService.search(
				permissionChecker.getCompanyId(), null, null, null, 0, max);
		}

		List<Group> groups = userPersistence.getGroups(
			permissionChecker.getUserId(), 0, max);

		groups = ListUtil.copy(groups);

		Iterator<Group> itr = groups.iterator();

		while (itr.hasNext()) {
			Group group = itr.next();

			if (!GroupPermissionUtil.contains(
					permissionChecker, group.getGroupId(), actionId)) {

				itr.remove();
			}
		}

		return groups;
	}

	public List<Group> getOrganizationsGroups(
		List<Organization> organizations) {

		return groupLocalService.getOrganizationsGroups(organizations);
	}

	public Group getUserGroup(long companyId, long userId)
		throws PortalException, SystemException {

		return groupLocalService.getUserGroup(companyId, userId);
	}

	public List<Group> getUserGroupsGroups(List<UserGroup> userGroups) {
		return groupLocalService.getUserGroupsGroups(userGroups);
	}

	public List<Group> getUserOrganizationsGroups(
			long userId, int start, int end)
		throws PortalException, SystemException {

		return groupLocalService.getUserOrganizationsGroups(userId, start, end);
	}

	public boolean hasUserGroup(long userId, long groupId)
		throws SystemException {

		return groupLocalService.hasUserGroup(userId, groupId);
	}

	public List<Group> search(
			long companyId, String name, String description, String[] params,
			int start, int end)
		throws SystemException {

		LinkedHashMap<String, Object> paramsObj = MapUtil.toLinkedHashMap(
			params);

		return groupLocalService.search(
			companyId, name, description, paramsObj, start, end);
	}

	public int searchCount(
			long companyId, String name, String description, String[] params)
		throws SystemException {

		LinkedHashMap<String, Object> paramsObj = MapUtil.toLinkedHashMap(
			params);

		return groupLocalService.searchCount(
			companyId, name, description, paramsObj);
	}

	public void setRoleGroups(long roleId, long[] groupIds)
		throws PortalException, SystemException {

		RolePermissionUtil.check(
			getPermissionChecker(), roleId, ActionKeys.UPDATE);

		groupLocalService.setRoleGroups(roleId, groupIds);
	}

	public void unsetRoleGroups(long roleId, long[] groupIds)
		throws PortalException, SystemException {

		RolePermissionUtil.check(
			getPermissionChecker(), roleId, ActionKeys.UPDATE);

		groupLocalService.unsetRoleGroups(roleId, groupIds);
	}

	public Group updateFriendlyURL(long groupId, String friendlyURL)
		throws PortalException, SystemException {

		GroupPermissionUtil.check(
			getPermissionChecker(), groupId, ActionKeys.UPDATE);

		return groupLocalService.updateFriendlyURL(groupId, friendlyURL);
	}

	public Group updateGroup(
			long groupId, String name, String description, int type,
			String friendlyURL, boolean active, ServiceContext serviceContext)
		throws PortalException, SystemException {

		GroupPermissionUtil.check(
			getPermissionChecker(), groupId, ActionKeys.UPDATE);

		return groupLocalService.updateGroup(
			groupId, name, description, type, friendlyURL, active,
			serviceContext);
	}

	public Group updateGroup(long groupId, String typeSettings)
		throws PortalException, SystemException {

		GroupPermissionUtil.check(
			getPermissionChecker(), groupId, ActionKeys.UPDATE);

		return groupLocalService.updateGroup(groupId, typeSettings);
	}

	public Group updateWorkflow(
			long groupId, boolean workflowEnabled, int workflowStages,
			String workflowRoleNames)
		throws PortalException, SystemException {

		GroupPermissionUtil.check(
			getPermissionChecker(), groupId, ActionKeys.MANAGE_STAGING);

		return groupLocalService.updateWorkflow(
			groupId, workflowEnabled, workflowStages, workflowRoleNames);
	}

}