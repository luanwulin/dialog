define(function(require) {
    var Dialog = require('../src/dialog');
    var $ = require('$');

    describe('dialog', function() {
        var example;

        afterEach(function() {
            if (example) {
                example.destroy();
                example = null;
            }
        });

        describe('content', function() {

            it('is dom', function() {
                $('<div id="test1">test1</div>').appendTo(document.body);
                example = new Dialog({
                    content: $('#test1')
                });
                example.render();

                var test = example.$('.ui-dialog-content').children().eq(0);
                expect(test.attr('id')).to.be('test1');
                expect(test.html()).to.be('test1');
            });

            it('is string', function() {
                example = new Dialog({
                    content: 'test2'
                });
                example.render();

                expect(example.$('.ui-dialog-content').html()).to.be('test2');
            });

            it('is html', function() {
                example = new Dialog({
                    content: '<div id="test3">test3</div>'
                });
                example.render();

                var test = example.$('.ui-dialog-content').children().eq(0);
                expect(test.attr('id')).to.be('test3');
                expect(test.html()).to.be('test3');
            });

            it('is relative url', function() {
                example = new Dialog({
                    content: './height300px.html'
                });
                example.render().show();

                var iframe = example.$('iframe');
                expect(iframe.length).to.be(1);
                expect(iframe.attr('src').replace(/&t=\d*$/, ''))
                    .to.be('./height300px.html?_dialog=true');
            });

            it('is absolute url', function() {
                example = new Dialog({
                    content: 'https://www.alipay.com'
                });
                example.render().show();

                var iframe = example.$('iframe');
                expect(iframe.length).to.be(1);
                expect(iframe.attr('src').replace(/&t=\d*$/, ''))
                    .to.be('http://www.alipay.com?_dialog=true');
            });

            it('is invalid url', function() {
                example = new Dialog({
                    content: 'demo.html'
                });
                example.render().show();

                var iframe = example.$('iframe');
                expect(iframe.length).to.be(0);
                expect(example.$('.ui-dialog-content').html())
                    .to.be('demo.html');
            });
        });

        describe('Height', function() {
            it('should init without height when type is dom', function() {
                example = new Dialog({
                    content: '<div id="test" style="height:200px;"></div>'
                });

                var spy = sinon.spy(example, '_onRenderHeight');

                example.show();
                expect(example._onRenderHeight).not.to.be.called();
                spy.restore();
            });

            it('should init with height when type is dom', function() {
                example = new Dialog({
                    height: '300px',
                    content: '<div id="test" style="height:200px;"></div>'
                });

                var spy = sinon.spy(example, '_onRenderHeight');

                example.show();
                expect(spy).to.be.called.withArgs('300px');
                spy.restore();
            });

            it('should init with height when type is iframe', function(done) {
                example = new Dialog({
                    height: '200px',
                    content: './height300px.html'
                });

                var spy = sinon.spy(example, '_onRenderHeight');

                example.show();
                setTimeout(function() {
                    expect(spy).to.be.called.withArgs('200px');
                    spy.restore();
                    done();
                }, 500);
            });

            it('should init without height when type is iframe', function(done) {
                var h, isComplete = false;
                example = new Dialog({
                    content: './height300px.html'
                });

                var spy = sinon.spy(example, '_onRenderHeight');

                example.show();

                setTimeout(function() {
                    expect(example._onRenderHeight)
                        .to.be.called.withArgs('300px');

                    $('iframe')[0].contentWindow.document
                        .getElementById('container').style.height = '400px';
                    example._syncHeight();
                    expect(spy).to.be.called.withArgs('400px');
                    spy.restore();
                    done();
                }, 500);
            });
        });

        describe('interval', function() {
            it('should sync height', function(done) {
                var isComplete = false;
                example = new Dialog({
                    content: './height300px.html'
                }).show();

                setTimeout(function() {
                    expect(example._interval).to.be.ok();
                    example.hide();
                    expect(example._interval).to.be(undefined);
                    done();
                }, 500);
            });

            it('should stop when set height', function(done) {
                var isComplete = false;
                example = new Dialog({
                    height: '300px',
                    content: './height300px.html'
                }).show();

                setTimeout(function() {
                    expect(example._interval).to.be(undefined);
                    done();
                }, 500);
            });

            it('should stop when crossdomain', function(done) {
                var isComplete = false;
                example = new Dialog({
                    content: 'http://www.baidu.com'
                }).show();

                setTimeout(function() {
                    expect(example._interval).to.be(undefined);
                    done();
                }, 500);
            });

            it('should stop when autoFit is false', function(done) {
                var isComplete = false;
                example = new Dialog({
                    autoFit: false,
                    content: 'http://www.baidu.com'
                }).show();

                setTimeout(function() {
                    expect(example._interval).to.be(undefined);
                    done();
                }, 500);
            });
        });

        it('bind close event', function() {
            example = new Dialog({
                content: 'http://www.alipay.com'
            });
            var iframe = example.$('iframe')[0];
            iframe.trigger('close');
            expect(example.get('visible')).not.to.be.ok();
        });

        it('get top with long height', function() {
            example = new Dialog({
                height: '1500px',
                content: 'test'
            }).show();
            expect(example.element.css('top')).to.be('30px');
        });

        it('get top with golden ratio', function() {
            example = new Dialog({
                height: '100px',
                content: 'test'
            });

            example.render().show();
            expect(example.get('align').selfXY).to.eql(['50%', '50%']);
            expect(example.get('align').baseXY).to.eql(['50%', '38%']);
        });

        it('before show set content', function() {
            example = new Dialog()
                .before('show', function() {
                    this.set('content', 'test');
                }).render();

            expect(example.$('.ui-dialog-content').html()).to.be('');

            example.show();

            expect(example.$('.ui-dialog-content').html()).to.be('test');
        });

        it('fixUrl support hash #25', function() {
            example = new Dialog({
                content: 'http://baidu.com/index.html?param=aa#'
            }).render().show();

            var url = example.$('iframe').attr('src').replace(/&t=\d{13}/, '');
            expect(url).to.be('http://baidu.com/index.html?param=aa&_dialog=true#');
        });

        it('should call onload once', function(done) {
            example = new Dialog({
                content: './height200px.html'
            });

            var syncHeight = sinon.spy(example, '_syncHeight');
            var syncTop = sinon.spy(example, '_syncTop');
            var onRenderHeight = sinon.spy(example, '_onRenderHeight');

            example.show();

            setTimeout(function() {
                expect(syncHeight).to.be.called.once();
                expect(syncTop).to.be.called.twice();
                console.dir(onRenderHeight);
                expect(onRenderHeight).to.be.called.twice();
                done();
            }, 500);
        });
    });
});
