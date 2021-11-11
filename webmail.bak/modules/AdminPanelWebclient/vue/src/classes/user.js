import _ from 'lodash'

import typesUtils from 'src/utils/types'

import enums from 'src/enums'

class UserModel {
  constructor (tenantId, serverData, completeData = null) {
    this.tenantId = tenantId
    this.id = typesUtils.pInt(serverData?.Id)
    this.name = typesUtils.pString(serverData?.Name)
    this.publicId = typesUtils.pString(serverData?.PublicId)
    this.uuid = typesUtils.pString(serverData?.UUID)
    this.quotaBytes = typesUtils.pInt(serverData?.QuotaBytes)

    this.setCompleteData(completeData)
  }

  setCompleteData (data) {
    this.completeData = data

    this.update(data)
  }

  update (data) {
    const UserRoles = enums.getUserRoles()
    this.role = typesUtils.pEnum(data?.Role, UserRoles, UserRoles.Anonymous)
    this.writeSeparateLog = typesUtils.pBool(data?.WriteSeparateLog)

    if (data?.PublicId) {
      this.publicId = typesUtils.pString(data?.PublicId)
    }

    if (data?.QuotaBytes) {
      this.quotaBytes = typesUtils.pInt(data?.QuotaBytes)
    }
  }

  getData (field) {
    return this.completeData && this.completeData[field]
  }

  updateData (fieldsData) {
    if (!_.isEmpty(this.completeData)) {
      fieldsData.forEach(data => {
        if (this.completeData[data.field] !== undefined) {
          this.completeData[data.field] = data.value
        }
      })
    }
  }
}

export default UserModel
