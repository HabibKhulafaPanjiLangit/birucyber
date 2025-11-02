'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface UserFormData {
  email: string
  name: string
  username: string
  password: string
  role: string
  // XSS Testing Fields
  authorName: string
  bio: string
  // Access Control Testing Fields
  accessToken: string
  allowedResources: string
  // Additional Fields
  avatar: string
  phone: string
  address: string
}

export default function UserRegistrationForm() {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    username: '',
    password: 'default123',
    role: 'USER',
    authorName: '',
    bio: '',
    accessToken: '',
    allowedResources: '',
    avatar: '',
    phone: '',
    address: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [createdUser, setCreatedUser] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-fill related fields
    if (name === 'name' && !formData.authorName) {
      setFormData(prev => ({ ...prev, authorName: value }))
    }
    if (name === 'email' && !formData.username) {
      setFormData(prev => ({ ...prev, username: value.split('@')[0] }))
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }))
    
    // Auto-set allowed resources based on role
    let resources: string[] = []
    switch (value) {
      case 'ADMIN':
        resources = ['/public', '/home', '/profile', '/dashboard', '/admin', '/api/users', '/api/reports']
        break
      case 'USER':
        resources = ['/public', '/home', '/profile', '/dashboard']
        break
      case 'GUEST':
        resources = ['/public', '/home']
        break
    }
    setFormData(prev => ({ ...prev, allowedResources: JSON.stringify(resources, null, 2) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setCreatedUser(null)

    try {
      // Parse allowed resources if it's a string
      let parsedResources = formData.allowedResources
      try {
        if (parsedResources) {
          parsedResources = JSON.parse(parsedResources)
        }
      } catch {
        // If parsing fails, keep as is
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          allowedResources: parsedResources
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setCreatedUser(data.details)
        // Reset form
        setFormData({
          email: '',
          name: '',
          username: '',
          password: 'default123',
          role: 'USER',
          authorName: '',
          bio: '',
          accessToken: '',
          allowedResources: '',
          avatar: '',
          phone: '',
          address: ''
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create user' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const generateToken = () => {
    const token = `token_${formData.username || 'user'}_${Date.now()}`
    setFormData(prev => ({ ...prev, accessToken: token }))
  }

  return (
    <div className="space-y-6">
      <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl text-cyan-400">🎯 Register New User</CardTitle>
          <CardDescription className="text-slate-400">
            Create a complete user profile with XSS and Access Control testing fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                👤 Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cyan-300">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800 border-cyan-500/30 text-white"
                    placeholder="user@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cyan-300">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800 border-cyan-500/30 text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-cyan-300">Username *</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800 border-cyan-500/30 text-white"
                    placeholder="johndoe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-cyan-300">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-cyan-500/30 text-white"
                    placeholder="default123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-cyan-300">Role *</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="bg-slate-800 border-cyan-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-cyan-500/30">
                      <SelectItem value="GUEST">🔒 Guest</SelectItem>
                      <SelectItem value="USER">👤 User</SelectItem>
                      <SelectItem value="ADMIN">⚡ Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-cyan-300">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-cyan-500/30 text-white"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-cyan-300">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-cyan-500/30 text-white"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>

            {/* XSS Testing Fields */}
            <div className="space-y-4 border-t border-cyan-500/20 pt-4">
              <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                ⚡ XSS Testing Fields
                <Badge variant="outline" className="text-orange-400 border-orange-400/50">
                  For Comment Testing
                </Badge>
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authorName" className="text-orange-300">
                    Author Name (for XSS comments)
                  </Label>
                  <Input
                    id="authorName"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-orange-500/30 text-white"
                    placeholder="John Doe"
                  />
                  <p className="text-xs text-slate-400">
                    This will be used as the author field in XSS testing
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-orange-300">User Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-orange-500/30 text-white min-h-[80px]"
                    placeholder="Security researcher and penetration tester..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar" className="text-orange-300">Avatar URL</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-orange-500/30 text-white"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Access Control Testing Fields */}
            <div className="space-y-4 border-t border-cyan-500/20 pt-4">
              <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                🔐 Access Control Testing Fields
                <Badge variant="outline" className="text-purple-400 border-purple-400/50">
                  For Authorization Testing
                </Badge>
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="accessToken" className="text-purple-300">
                      Access Token (User Token)
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={generateToken}
                      className="text-purple-400 border-purple-400/50 hover:bg-purple-500/10"
                    >
                      🎲 Generate Token
                    </Button>
                  </div>
                  <Input
                    id="accessToken"
                    name="accessToken"
                    value={formData.accessToken}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-purple-500/30 text-white font-mono text-sm"
                    placeholder="token_user_1234567890"
                  />
                  <p className="text-xs text-slate-400">
                    This token will be used in Access Control testing as userToken parameter
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowedResources" className="text-purple-300">
                    Allowed Resources (JSON Array)
                  </Label>
                  <Textarea
                    id="allowedResources"
                    name="allowedResources"
                    value={formData.allowedResources}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-purple-500/30 text-white font-mono text-sm min-h-[120px]"
                    placeholder='["/public", "/home", "/profile"]'
                  />
                  <p className="text-xs text-slate-400">
                    Resources this user can access. Auto-filled based on role.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
              >
                {loading ? '⏳ Creating User...' : '✅ Create User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success/Error Message */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Created User Details */}
      {createdUser && (
        <Card className="border-green-500/20 bg-green-900/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-green-400">✅ User Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">User ID</p>
                <p className="text-white font-mono text-sm">{createdUser.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="text-white">{createdUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Username</p>
                <p className="text-white">{createdUser.username}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Role</p>
                <Badge className="bg-cyan-500/20 text-cyan-400">{createdUser.role}</Badge>
              </div>
            </div>

            {/* XSS Testing Info */}
            <div className="border-t border-green-500/20 pt-4">
              <h4 className="text-orange-400 font-semibold mb-2">⚡ XSS Testing</h4>
              <div className="bg-slate-800/50 p-3 rounded space-y-2">
                <p className="text-sm text-slate-300">
                  <span className="text-orange-400">Author Name:</span>{' '}
                  <span className="font-mono">{createdUser.authorName}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Use this name in the XSS comment author field
                </p>
              </div>
            </div>

            {/* Access Control Testing Info */}
            <div className="border-t border-green-500/20 pt-4">
              <h4 className="text-purple-400 font-semibold mb-2">🔐 Access Control Testing</h4>
              <div className="bg-slate-800/50 p-3 rounded space-y-2">
                <p className="text-sm text-slate-300">
                  <span className="text-purple-400">Access Token:</span>{' '}
                  <span className="font-mono text-xs">{createdUser.accessToken}</span>
                </p>
                <p className="text-sm text-slate-300">
                  <span className="text-purple-400">Allowed Resources:</span>
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {createdUser.allowedResources?.map((resource: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-purple-400 border-purple-400/50 text-xs">
                      {resource}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Use this token as userToken in Access Control testing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
