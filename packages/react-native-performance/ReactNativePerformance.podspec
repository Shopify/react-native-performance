require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name             = "ReactNativePerformance"
  s.version          = package['version']
  s.summary          = package['description']
  s.homepage         = package['homepage']
  s.license          = package['license']
  s.author           = package['author']
  s.platform         = :ios, '11.0'
  s.source           = { :git => 'https://github.com/shopify/react-native-performance.git', :tag => "v#{s.version}" }
  s.source_files     = 'ios/**/*.{h,m,swift}'
  s.exclude_files    = 'ios/**/*Tests.{h,m,swift}'
  s.requires_arc     = true
  s.swift_version    = '5.0'

  # Dependencies
  s.dependency 'React-Core'

  # Remote Pods

  # Tests spec
  s.test_spec "Tests" do |test_spec|
    test_spec.source_files = 'ios/**/*Tests.{h, m,swift}'
    test_spec.framework = 'XCTest'
  end
end
